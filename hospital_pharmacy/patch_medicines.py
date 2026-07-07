import frappe

def patch():
    frappe.init(site="hospital.com")
    frappe.connect()
    
    frappe.db.sql("""
        UPDATE tabItem 
        SET has_batch_no = 1, has_expiry_date = 1, create_new_batch = 0 
        WHERE item_group = 'Medicine'
    """)
    
    frappe.db.commit()
    print("Patched items directly in DB.")

if __name__ == "__main__":
    patch()
