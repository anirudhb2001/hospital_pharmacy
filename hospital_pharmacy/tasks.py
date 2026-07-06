import frappe
from frappe.utils import today, add_days

def check_expiry():
    # Find medicines expiring in the next 30 days
    expiring_soon = frappe.get_all("Medicine", 
                                   filters={"expiry_date": ["<=", add_days(today(), 30)], "expiry_date": [">=", today()], "status": "Active"},
                                   fields=["name", "medicine_name", "expiry_date"])
    
    for medicine in expiring_soon:
        # Create a notification or ToDo
        frappe.get_doc({
            "doctype": "ToDo",
            "description": f"Medicine {medicine.medicine_name} is expiring on {medicine.expiry_date}",
            "reference_type": "Medicine",
            "reference_name": medicine.name,
            "allocated_to": "Administrator",
            "status": "Open"
        }).insert(ignore_permissions=True)
        
    # Expired medicines
    expired = frappe.get_all("Medicine",
                             filters={"expiry_date": ["<", today()], "status": "Active"},
                             fields=["name", "medicine_name"])
                             
    for medicine in expired:
        frappe.db.set_value("Medicine", medicine.name, "status", "Inactive")
        frappe.get_doc({
            "doctype": "ToDo",
            "description": f"Medicine {medicine.medicine_name} has expired and marked Inactive.",
            "reference_type": "Medicine",
            "reference_name": medicine.name,
            "allocated_to": "Administrator",
            "status": "Open"
        }).insert(ignore_permissions=True)

def check_low_stock():
    low_stock_medicines = frappe.get_all("Medicine",
                                         filters={"current_stock": ["<=", "minimum_stock"], "status": "Active"},
                                         fields=["name", "medicine_name", "current_stock", "minimum_stock"])
                                         
    for medicine in low_stock_medicines:
        frappe.get_doc({
            "doctype": "ToDo",
            "description": f"Low Stock Alert: {medicine.medicine_name} (Current: {medicine.current_stock}, Min: {medicine.minimum_stock})",
            "reference_type": "Medicine",
            "reference_name": medicine.name,
            "allocated_to": "Administrator",
            "status": "Open"
        }).insert(ignore_permissions=True)
