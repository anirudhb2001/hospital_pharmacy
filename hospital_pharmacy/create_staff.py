import frappe

def create_user(email, first_name, role, password="Password@123"):
    if not frappe.db.exists("User", email):
        user = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "first_name": first_name,
            "send_welcome_email": 0,
            "new_password": password
        })
        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()
    else:
        user = frappe.get_doc("User", email)
        user.new_password = password
        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.save()
        
    if not frappe.db.exists("Role", role):
        frappe.get_doc({"doctype": "Role", "role_name": role}).insert(ignore_permissions=True)
        
    user.add_roles(role)
    print(f"Created/Updated {email} with role {role}")

def setup():
    frappe.init(site="hospital.com")
    frappe.connect()
    
    create_user("pharmacist@hospital.com", "John Pharmacist", "Pharmacist")
    create_user("cashier@hospital.com", "Jane Cashier", "Cashier")
    create_user("manager@hospital.com", "Admin Manager", "Pharmacy Manager")
    
    frappe.db.commit()
    print("Done")

setup()
