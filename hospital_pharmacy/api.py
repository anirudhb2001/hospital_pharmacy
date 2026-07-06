import frappe

@frappe.whitelist(allow_guest=True)
def get_medicines():
    return frappe.get_all("Medicine", fields=["name", "medicine_name", "generic_name", "brand", "category", "manufacturer", "selling_price", "mrp", "current_stock", "image", "status"], filters={"status": "Active"})

@frappe.whitelist(allow_guest=True)
def get_medicine_details(medicine_name):
    return frappe.get_doc("Medicine", medicine_name)

@frappe.whitelist(allow_guest=True)
def register_customer(full_name, email, phone, password):
    # Create User
    if not frappe.db.exists("User", email):
        user = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "first_name": full_name,
            "new_password": password,
            "send_welcome_email": 0
        })
        user.flags.ignore_permissions = True
        user.insert()
    
    # Create Customer
    if not frappe.db.exists("Customer", {"customer_name": full_name, "email_id": email}):
        customer = frappe.get_doc({
            "doctype": "Customer",
            "customer_name": full_name,
            "customer_type": "Individual",
            "customer_group": "Commercial",
            "territory": "All Territories",
            "email_id": email,
            "mobile_no": phone
        })
        customer.flags.ignore_permissions = True
        customer.insert()
        
    return {"status": "success", "message": "Registered successfully"}

@frappe.whitelist()
def place_order(items, customer_email, payment_method):
    import json
    items = json.loads(items)
    customer = frappe.db.get_value("Customer", {"email_id": customer_email}, "name")
    
    if not customer:
        frappe.throw("Customer not found")
        
    # Create Sales Order
    so = frappe.get_doc({
        "doctype": "Sales Order",
        "customer": customer,
        "delivery_date": frappe.utils.add_days(frappe.utils.today(), 1),
        "items": []
    })
    
    for item in items:
        medicine = frappe.get_doc("Medicine", item['medicine'])
        so.append("items", {
            "item_code": medicine.item,
            "qty": item['qty'],
            "rate": medicine.selling_price
        })
        
    so.flags.ignore_permissions = True
    so.insert()
    so.submit()
    
    return {"status": "success", "order_id": so.name}

@frappe.whitelist()
def get_dashboard_stats():
    today = frappe.utils.today()
    
    sales_today = frappe.db.sql("""SELECT sum(grand_total) FROM `tabSales Invoice` WHERE docstatus=1 AND posting_date=%s""", (today,))
    purchases_today = frappe.db.sql("""SELECT sum(grand_total) FROM `tabPurchase Invoice` WHERE docstatus=1 AND posting_date=%s""", (today,))
    
    low_stock = frappe.db.count("Medicine", {"current_stock": ["<=", "minimum_stock"]})
    expired = frappe.db.count("Medicine", {"expiry_date": ["<", today]})
    
    return {
        "sales_today": sales_today[0][0] or 0,
        "purchases_today": purchases_today[0][0] or 0,
        "low_stock": low_stock,
        "expired": expired
    }
