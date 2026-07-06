import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_medicines():
    return frappe.get_all("Medicine", 
        fields=["name", "medicine_name", "generic_name", "category", "selling_price", "current_stock", "status", "image"],
        filters={"status": "Active"}
    )

@frappe.whitelist(allow_guest=True)
def search_everything(query):
    # Dummy unified search implementation
    medicines = frappe.get_all("Medicine", filters={"medicine_name": ["like", f"%{query}%"]}, fields=["name", "medicine_name"])
    customers = frappe.get_all("Customer", filters={"customer_name": ["like", f"%{query}%"]}, fields=["name", "customer_name"])
    
    return {
        "medicines": medicines,
        "customers": customers
    }

@frappe.whitelist(allow_guest=True)
def register_customer(full_name, email, phone, password):
    if frappe.db.exists("User", email):
        frappe.throw(_("User with this email already exists"))
        
    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": full_name,
        "new_password": password,
        "send_welcome_email": 0
    })
    user.flags.ignore_permissions = True
    user.flags.ignore_password_policy = True
    user.insert()
    
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

@frappe.whitelist(allow_guest=True)
def customer_login(email, password):
    try:
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=email, pwd=password)
        login_manager.post_login()
        return {"status": "success", "user": frappe.session.user}
    except frappe.exceptions.AuthenticationError:
        frappe.clear_messages()
        frappe.throw(_("Invalid Login Credentials"), frappe.AuthenticationError)

@frappe.whitelist(allow_guest=True)
def admin_login(email, password):
    try:
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=email, pwd=password)
        login_manager.post_login()
        
        # Role Validation
        user_roles = frappe.get_roles(frappe.session.user)
        allowed_roles = ["System Manager", "Hospital Administrator", "Pharmacy Manager", "Pharmacist", "Cashier"]
        
        if not any(role in allowed_roles for role in user_roles):
            frappe.local.login_manager.logout()
            frappe.throw(_("Unauthorized Access: You do not have the required staff privileges."))
            
        return {"status": "success", "user": frappe.session.user}
    except frappe.exceptions.AuthenticationError:
        frappe.clear_messages()
        frappe.throw(_("Invalid Login Credentials"), frappe.AuthenticationError)

@frappe.whitelist()
def get_dashboard_data():
    today = frappe.utils.today()
    
    sales_today = frappe.db.sql("""SELECT sum(grand_total) FROM `tabSales Invoice` WHERE docstatus=1 AND posting_date=%s""", (today,))
    purchases_today = frappe.db.sql("""SELECT sum(grand_total) FROM `tabPurchase Invoice` WHERE docstatus=1 AND posting_date=%s""", (today,))
    
    low_stock = frappe.db.count("Medicine", {"current_stock": ["<=", "minimum_stock"]})
    
    return {
        "sales_today": sales_today[0][0] or 0,
        "purchases_today": purchases_today[0][0] or 0,
        "low_stock": low_stock
    }
