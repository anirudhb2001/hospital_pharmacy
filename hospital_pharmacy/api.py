import frappe
from frappe import _

# ─────────────────────────────────────────────────────────────
# PUBLIC – Medicine Catalog APIs
# ─────────────────────────────────────────────────────────────

@frappe.whitelist(allow_guest=True)
def get_medicines(search="", category="", brand="", availability="", prescription="", sort="name", page=1, page_size=12):
    """Return paginated medicine list for the portal with live stock."""
    
    conditions = ["m.status = 'Active'"]
    values = []
    
    if search:
        conditions.append("(m.medicine_name LIKE %s OR m.generic_name LIKE %s OR m.category LIKE %s)")
        values.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
    if category:
        conditions.append("m.category = %s")
        values.append(category)
    if brand:
        conditions.append("m.brand = %s")
        values.append(brand)
        
    order_map = {
        "name": "m.medicine_name ASC",
        "price_asc": "m.selling_price ASC",
        "price_desc": "m.selling_price DESC",
        "newest": "m.creation DESC",
    }
    order_by = order_map.get(sort, "m.medicine_name ASC")
    
    having_clause = ""
    if availability == "in_stock":
        having_clause = "HAVING actual_qty > 0"
        
    where_clause = " AND ".join(conditions)
    if where_clause:
        where_clause = "WHERE " + where_clause
        
    page = int(page)
    page_size = int(page_size)
    offset = (page - 1) * page_size
    
    # Query for the records
    query = f"""
        SELECT 
            m.name, m.medicine_name, m.generic_name, m.brand, m.category,
            m.manufacturer, m.selling_price, m.mrp, m.status,
            m.image, m.description, m.expiry_date, m.barcode, m.item,
            IFNULL(SUM(b.actual_qty), 0) AS actual_qty
        FROM `tabMedicine` m
        LEFT JOIN `tabBin` b ON m.item = b.item_code
        {where_clause}
        GROUP BY m.name
        {having_clause}
        ORDER BY {order_by}
        LIMIT %s OFFSET %s
    """
    
    # Query for the total count
    count_query = f"""
        SELECT COUNT(*) FROM (
            SELECT m.name
            FROM `tabMedicine` m
            LEFT JOIN `tabBin` b ON m.item = b.item_code
            {where_clause}
            GROUP BY m.name
            {having_clause}
        ) AS t
    """
    
    medicines = frappe.db.sql(query, tuple(values + [page_size, offset]), as_dict=True)
    total = frappe.db.sql(count_query, tuple(values))[0][0]
    
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
# NOTIFICATIONS
# ─────────────────────────────────────────────────────────────
def create_admin_notification(subject, description, doc_type=None, doc_name=None, priority="Alert"):
    admins = frappe.get_all("Has Role", filters={"role": "System Manager", "parenttype": "User"}, pluck="parent")
    for admin in set(admins):
        doc = frappe.new_doc("Notification Log")
        doc.subject = subject
        doc.email_content = description
        if doc_type and doc_name:
            doc.document_type = doc_type
            doc.document_name = doc_name
        doc.for_user = admin
        doc.type = "Alert"
        doc.insert(ignore_permissions=True)

@frappe.whitelist()
def get_admin_notifications():
    if not frappe.has_permission("Notification Log", "read"):
        return []
    user = frappe.session.user
    notifications = frappe.get_all("Notification Log", 
        filters={"for_user": user},
        fields=["name", "subject", "email_content", "document_type", "document_name", "type", "read", "creation"],
        order_by="creation desc",
        limit=50
    )
    return notifications

@frappe.whitelist()
def mark_notification_read(name):
    frappe.db.set_value("Notification Log", name, "read", 1)
    return {"status": "success"}

@frappe.whitelist()
def mark_all_notifications_read():
    frappe.db.sql("UPDATE `tabNotification Log` SET `read` = 1 WHERE for_user = %s", frappe.session.user)
    return {"status": "success"}


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
        
    create_admin_notification("New Customer Registration", f"Customer {full_name} ({email}) has registered.", "Customer", customer.name if 'customer' in locals() else None)

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
            "Administrator", "System Manager", "Hospital Administrator",
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
# CHECKOUT API
# ─────────────────────────────────────────────────────────────

@frappe.whitelist()
def place_order(items, address, phone, notes, payment_method):
    try:
        if isinstance(items, str):
            import json
            items = json.loads(items)
            
        user = frappe.session.user
        if user == "Guest":
            return {"status": "error", "message": "Must be logged in to create an order"}
            
        # Get Customer
        user_doc = frappe.get_doc("User", user)
        customer = frappe.db.get_value("Customer", {"email_id": user}, "name")
        
        if not customer:
            customer = frappe.db.get_value("Customer", {"customer_name": user_doc.full_name}, "name")
            
        if not customer:
            customer_doc = frappe.get_doc({
                "doctype": "Customer",
                "customer_name": user_doc.full_name,
                "customer_type": "Individual",
                "customer_group": "Commercial",
                "territory": "All Territories",
                "mobile_no": phone,
                "email_id": user
            })
            customer_doc.insert(ignore_permissions=True)
            customer = customer_doc.name
                
        # Create Sales Order
        so = frappe.new_doc("Sales Order")
        so.customer = customer
        so.delivery_date = frappe.utils.add_days(frappe.utils.today(), 1)
        
        company = frappe.defaults.get_user_default("Company") or frappe.db.get_value("Company", None, "name")
        so.company = company
        
        so.add_comment("Comment", f"Delivery Address: {address}\\nPhone: {phone}\\nNotes: {notes}\\nPayment: {payment_method}")
        
        for item in items:
            item_code = item.get("item_code")
            qty = item.get("qty")
            
            # Stock check
            warehouse_data = frappe.db.sql("""
                SELECT warehouse, actual_qty FROM tabBin
                WHERE item_code = %s AND actual_qty >= %s
                LIMIT 1
            """, (item_code, qty))
            
            warehouse = warehouse_data[0][0] if warehouse_data else None
            actual_qty = warehouse_data[0][1] if warehouse_data else 0
            
            if not warehouse:
                create_admin_notification("Out of Stock Warning", f"Attempted to order {qty} of {item_code} but it is out of stock.", priority="Alert")
                return {"status": "error", "message": f"Item {item_code} is out of stock."}
            elif (actual_qty - qty) <= 10:
                create_admin_notification("Low Stock Alert", f"Item {item_code} stock will drop to {actual_qty - qty} after this order.", priority="Warning")
            
            so.append("items", {
                "item_code": item_code,
                "qty": qty,
                "rate": item.get("rate"),
                "warehouse": warehouse
            })
            
        so.flags.ignore_permissions = True
        so.insert()
        so.submit()
        
        create_admin_notification("New Sales Order", f"New Sales Order {so.name} placed by {customer}.", "Sales Order", so.name, priority="Info")
        
        if payment_method == "Online Payment":
            original_user = frappe.session.user
            frappe.set_user("Administrator")
            try:
                from frappe.model.mapper import get_mapped_doc
            
                si = frappe.get_doc(get_mapped_doc("Sales Order", so.name, {
                    "Sales Order": {
                        "doctype": "Sales Invoice"
                    },
                    "Sales Order Item": {
                        "doctype": "Sales Invoice Item",
                        "field_map": {
                            "name": "so_detail",
                            "parent": "sales_order",
                        }
                    }
                }, ignore_permissions=True))
                si.update_stock = 1
                si.flags.ignore_permissions = True
                si.insert()
                si.submit()
                
                pe = frappe.get_doc(get_mapped_doc("Sales Invoice", si.name, {
                    "Sales Invoice": {
                        "doctype": "Payment Entry",
                        "field_map": {
                            "party_account_currency": "payment_currency"
                        }
                    }
                }, ignore_permissions=True))
                pe.party_type = "Customer"
                pe.party = customer
                pe.payment_type = "Receive"
                pe.paid_to = frappe.db.get_value("Account", {"account_type": "Cash", "company": company}, "name")
                pe.paid_amount = si.grand_total
                pe.received_amount = si.grand_total
                pe.flags.ignore_permissions = True
                pe.insert()
                pe.submit()
                
                create_admin_notification("Payment Received", f"Payment received for {so.name} ({si.grand_total}).", "Payment Entry", pe.name, priority="Info")
            finally:
                frappe.set_user(original_user)
            
        frappe.db.commit()
        return {"status": "success", "order_id": so.name, "estimated_delivery": so.delivery_date}
        
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error("Order Placement Failed", frappe.get_traceback())
        return {"status": "error", "message": "An operational error occurred while processing your order. Please try again or contact support."}


# ─────────────────────────────────────────────────────────────
# ADMIN – Dashboard & search
# ─────────────────────────────────────────────────────────────

@frappe.whitelist()
def get_dashboard_data():
    today = frappe.utils.today()

    sales_today = frappe.db.sql(
        "SELECT IFNULL(sum(grand_total),0) FROM `tabSales Invoice` WHERE docstatus=1 AND posting_date=%s", (today,)
    )
    
    pending_orders = frappe.db.count("Sales Order", {"docstatus": 1, "status": ["in", ["To Deliver and Bill", "To Deliver", "To Bill"]]})
    total_invoices = frappe.db.count("Sales Invoice", {"docstatus": 1})
    
    low_stock = frappe.db.sql("SELECT COUNT(*) FROM (SELECT item_code, SUM(actual_qty) as qty FROM tabBin GROUP BY item_code HAVING qty <= 10) as t")[0][0]
    
    near_expiry = frappe.db.sql(
        "SELECT COUNT(*) FROM `tabMedicine` WHERE expiry_date BETWEEN %s AND %s AND status='Active'",
        (today, frappe.utils.add_days(today, 30))
    )[0][0]
    
    total_customers = frappe.db.count("Customer")
    
    return {
        "sales_today": float(sales_today[0][0] or 0),
        "pending_orders": pending_orders,
        "total_invoices": total_invoices,
        "low_stock": int(low_stock),
        "near_expiry": int(near_expiry),
        "total_customers": total_customers,
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

# ─────────────────────────────────────────────────────────────
# CUSTOMER ORDERS API
# ─────────────────────────────────────────────────────────────

@frappe.whitelist()
def get_customer_orders():
    user = frappe.session.user
    if user == "Guest":
        return {"status": "error", "message": "Must be logged in to view orders"}
        
    customer = frappe.db.get_value("Customer", {"email_id": user}, "name")
    if not customer:
        user_doc = frappe.get_doc("User", user)
        customer = frappe.db.get_value("Customer", {"customer_name": user_doc.full_name}, "name")
        
    if not customer:
        return {"status": "success", "orders": []}
        
    orders = frappe.get_all("Sales Order",
        filters={"customer": customer, "docstatus": ["<", 2]},
        fields=["name", "transaction_date", "status", "delivery_status", "billing_status", "grand_total"],
        order_by="creation desc"
    )
    
    for o in orders:
        items = frappe.db.sql('''
            SELECT 
                i.item_code, i.item_name, i.qty, i.rate, i.amount,
                m.image, m.medicine_name, m.generic_name
            FROM `tabSales Order Item` i
            LEFT JOIN `tabMedicine` m ON i.item_code = m.item
            WHERE i.parent = %s
        ''', o.name, as_dict=1)
        o["items"] = items
        
        # Calculate derived status
        if o.status == "Cancelled":
            o["payment_status"] = "Failed"
            o["order_status"] = "Cancelled"
        else:
            if o.billing_status == "Fully Billed":
                o["payment_status"] = "Paid"
            elif o.billing_status == "Partly Billed":
                o["payment_status"] = "Partially Paid"
            else:
                o["payment_status"] = "Pending"
                
            # Maps ERPNext status to consumer friendly terms
            if o.delivery_status == "Fully Delivered":
                o["order_status"] = "Delivered"
            elif o.status == "To Deliver":
                o["order_status"] = "Processing"
            elif o.status == "To Deliver and Bill":
                o["order_status"] = "Processing"
            else:
                o["order_status"] = "Confirmed"
                
    return {"status": "success", "orders": orders}
