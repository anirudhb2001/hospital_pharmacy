import frappe
from frappe import _

# ─────────────────────────────────────────────────────────────
# PUBLIC – Medicine Catalog APIs
# ─────────────────────────────────────────────────────────────

@frappe.whitelist(allow_guest=True)
def get_medicines(search="", category="", brand="", availability="", prescription="", sort="name", page=1, page_size=12):
    """Return paginated medicine list for the portal."""
    filters = {"status": "Active"}
    if search:
        filters["medicine_name"] = ["like", f"%{search}%"]
    if category:
        filters["category"] = category
    if brand:
        filters["brand"] = brand
    if availability == "in_stock":
        filters["current_stock"] = [">", 0]

    page = int(page)
    page_size = int(page_size)
    order_map = {
        "name": "medicine_name asc",
        "price_asc": "selling_price asc",
        "price_desc": "selling_price desc",
        "newest": "creation desc",
    }
    order_by = order_map.get(sort, "medicine_name asc")

    total = frappe.db.count("Medicine", filters)
    medicines = frappe.get_all(
        "Medicine",
        filters=filters,
        fields=[
            "name", "medicine_name", "generic_name", "brand", "category",
            "manufacturer", "selling_price", "mrp", "current_stock", "status",
            "image", "description", "expiry_date", "barcode",
        ],
        order_by=order_by,
        limit_start=(page - 1) * page_size,
        limit_page_length=page_size,
    )
    return {"medicines": medicines, "total": total, "page": page, "page_size": page_size}


@frappe.whitelist(allow_guest=True)
def get_medicine_filters():
    """Return distinct categories and brands for filter dropdowns."""
    categories = frappe.db.get_all(
        "Medicine", filters={"status": "Active"}, fields=["category"], distinct=True
    )
    brands = frappe.db.get_all(
        "Medicine", filters={"status": "Active", "brand": ["!=", ""]}, fields=["brand"], distinct=True
    )
    return {
        "categories": [c["category"] for c in categories if c["category"]],
        "brands": [b["brand"] for b in brands if b["brand"]],
    }


@frappe.whitelist(allow_guest=True)
def get_portal_stats():
    """KPI stats for the public storefront homepage."""
    total = frappe.db.count("Medicine", {"status": "Active"})
    available = frappe.db.count("Medicine", {"status": "Active", "current_stock": [">", 0]})
    categories = frappe.db.sql(
        "SELECT COUNT(DISTINCT category) FROM `tabMedicine` WHERE status='Active'"
    )[0][0]
    return {
        "total_medicines": total,
        "available_medicines": available,
        "medicine_categories": int(categories),
        "same_day_delivery": True,
    }


@frappe.whitelist(allow_guest=True)
def get_medicine_details(name):
    medicine = frappe.get_doc("Medicine", name)
    return medicine.as_dict()


# ─────────────────────────────────────────────────────────────
# AUTH APIs
# ─────────────────────────────────────────────────────────────

@frappe.whitelist(allow_guest=True)
def register_customer(full_name, email, phone, password):
    if frappe.db.exists("User", email):
        frappe.throw(_("A user with this email already exists."))

    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": full_name,
        "new_password": password,
        "send_welcome_email": 0,
    })
    user.flags.ignore_permissions = True
    user.flags.ignore_password_policy = True
    user.insert()

    if not frappe.db.exists("Customer", {"customer_name": full_name}):
        customer = frappe.get_doc({
            "doctype": "Customer",
            "customer_name": full_name,
            "customer_type": "Individual",
            "customer_group": "Commercial",
            "territory": "All Territories",
            "mobile_no": phone,
        })
        customer.flags.ignore_permissions = True
        customer.insert()

    frappe.db.commit()
    return {"status": "success", "message": "Registered successfully"}


@frappe.whitelist(allow_guest=True)
def customer_login(email, password):
    try:
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=email, pwd=password)
        login_manager.post_login()
        frappe.db.commit()
        user = frappe.get_doc("User", frappe.session.user)
        return {
            "status": "success",
            "user": frappe.session.user,
            "full_name": user.full_name,
        }
    except frappe.exceptions.AuthenticationError:
        frappe.clear_messages()
        frappe.throw(_("Invalid email or password."), frappe.AuthenticationError)


@frappe.whitelist(allow_guest=True)
def admin_login(email, password):
    try:
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=email, pwd=password)
        login_manager.post_login()

        user_roles = frappe.get_roles(frappe.session.user)
        allowed_roles = [
            "System Manager", "Hospital Administrator",
            "Pharmacy Manager", "Pharmacist", "Cashier",
        ]
        if not any(role in allowed_roles for role in user_roles):
            frappe.local.login_manager.logout()
            frappe.throw(_("Unauthorized: You do not have staff access."))

        frappe.db.commit()
        user = frappe.get_doc("User", frappe.session.user)
        return {
            "status": "success",
            "user": frappe.session.user,
            "full_name": user.full_name,
        }
    except frappe.exceptions.AuthenticationError:
        frappe.clear_messages()
        frappe.throw(_("Invalid email or password."), frappe.AuthenticationError)


# ─────────────────────────────────────────────────────────────
# ADMIN – Dashboard & search
# ─────────────────────────────────────────────────────────────

@frappe.whitelist()
def get_dashboard_data():
    today = frappe.utils.today()

    sales_today = frappe.db.sql(
        "SELECT IFNULL(sum(grand_total),0) FROM `tabSales Invoice` WHERE docstatus=1 AND posting_date=%s", (today,)
    )
    purchases_today = frappe.db.sql(
        "SELECT IFNULL(sum(grand_total),0) FROM `tabPurchase Invoice` WHERE docstatus=1 AND posting_date=%s", (today,)
    )
    low_stock = frappe.db.count("Medicine", {"status": "Active", "current_stock": ["<=", 10]})
    near_expiry = frappe.db.sql(
        "SELECT COUNT(*) FROM `tabMedicine` WHERE expiry_date BETWEEN %s AND %s",
        (today, frappe.utils.add_days(today, 30))
    )[0][0]
    total_customers = frappe.db.count("Customer")
    total_medicines = frappe.db.count("Medicine", {"status": "Active"})

    return {
        "sales_today": float(sales_today[0][0] or 0),
        "purchases_today": float(purchases_today[0][0] or 0),
        "low_stock": low_stock,
        "near_expiry": int(near_expiry),
        "total_customers": total_customers,
        "total_medicines": total_medicines,
    }


@frappe.whitelist(allow_guest=True)
def search_everything(query):
    medicines = frappe.get_all(
        "Medicine",
        filters={"medicine_name": ["like", f"%{query}%"]},
        fields=["name", "medicine_name", "category"],
        limit=5,
    )
    customers = frappe.get_all(
        "Customer",
        filters={"customer_name": ["like", f"%{query}%"]},
        fields=["name", "customer_name"],
        limit=5,
    )
    return {"medicines": medicines, "customers": customers}
