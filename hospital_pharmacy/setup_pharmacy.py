import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def setup_naming_series():
    series_map = {
        "Supplier": "SUP-.YYYY.-.#####",
        "Customer": "CUS-.YYYY.-.#####",
        "Purchase Invoice": "PUR-.YYYY.-.#####",
        "Purchase Order": "PUR-ORD-.YYYY.-.#####",
        "Sales Invoice": "SAL-.YYYY.-.#####",
        "Sales Order": "SAL-ORD-.YYYY.-.#####",
        "Payment Entry": "PAY-.YYYY.-.#####",
        "Stock Entry": "STK-.YYYY.-.#####"
    }
    
    for doctype, series in series_map.items():
        # Update naming_series options if the field exists
        if frappe.get_meta(doctype).get_field("naming_series"):
            options = frappe.get_meta(doctype).get_field("naming_series").options or ""
            if series not in options:
                new_options = f"{series}\n{options}" if options else series
                make_property_setter(doctype, "naming_series", "options", new_options, "Text")
                make_property_setter(doctype, "naming_series", "default", series, "Data")
                print(f"Set naming series for {doctype} to {series}")

def create_roles():
    roles = [
        "System Manager",
        "Hospital Administrator",
        "Pharmacy Manager",
        "Pharmacist",
        "Cashier",
        "Supplier",
        "Customer"
    ]
    for role in roles:
        if not frappe.db.exists("Role", role):
            frappe.get_doc({
                "doctype": "Role",
                "role_name": role,
                "desk_access": 1 if role not in ["Supplier", "Customer"] else 0
            }).insert(ignore_permissions=True)
            print(f"Created role: {role}")

def create_medicine_doctype():
    if frappe.db.exists("DocType", "Medicine"):
        print("Medicine DocType already exists")
        return
        
    doc = frappe.get_doc({
        "doctype": "DocType",
        "module": "Hospital Pharmacy",
        "name": "Medicine",
        "custom": 0,
        "is_submittable": 0,
        "naming_rule": "Expression",
        "autoname": "MED-.YYYY.-.#####",
        "fields": [
            {"fieldname": "medicine_name", "label": "Medicine Name", "fieldtype": "Data", "reqd": 1, "in_list_view": 1},
            {"fieldname": "generic_name", "label": "Generic Name", "fieldtype": "Data", "in_list_view": 1},
            {"fieldname": "brand", "label": "Brand", "fieldtype": "Data"},
            {"fieldname": "category", "label": "Category", "fieldtype": "Select", "options": "\nTablet\nCapsule\nSyrup\nInjection\nDrops\nCream\nOintment\nPowder"},
            {"fieldname": "manufacturer", "label": "Manufacturer", "fieldtype": "Data"},
            
            {"fieldname": "cb_1", "fieldtype": "Column Break"},
            {"fieldname": "barcode", "label": "Barcode", "fieldtype": "Data", "unique": 1},
            {"fieldname": "unit", "label": "Unit", "fieldtype": "Link", "options": "UOM", "default": "Nos"},
            {"fieldname": "status", "label": "Status", "fieldtype": "Select", "options": "Active\nInactive", "default": "Active"},
            
            {"fieldname": "sec_stock", "label": "Stock and Batch", "fieldtype": "Section Break"},
            {"fieldname": "batch_number", "label": "Batch Number", "fieldtype": "Data"},
            {"fieldname": "expiry_date", "label": "Expiry Date", "fieldtype": "Date"},
            {"fieldname": "current_stock", "label": "Current Stock", "fieldtype": "Float", "read_only": 1},
            {"fieldname": "minimum_stock", "label": "Minimum Stock", "fieldtype": "Float", "default": "10"},
            {"fieldname": "maximum_stock", "label": "Maximum Stock", "fieldtype": "Float", "default": "1000"},
            
            {"fieldname": "sec_price", "label": "Pricing", "fieldtype": "Section Break"},
            {"fieldname": "purchase_price", "label": "Purchase Price", "fieldtype": "Currency"},
            {"fieldname": "selling_price", "label": "Selling Price", "fieldtype": "Currency"},
            {"fieldname": "mrp", "label": "MRP", "fieldtype": "Currency"},
            {"fieldname": "gst", "label": "GST %", "fieldtype": "Float", "default": "0"},
            
            {"fieldname": "sec_other", "label": "Additional Information", "fieldtype": "Section Break"},
            {"fieldname": "description", "label": "Description", "fieldtype": "Text Editor"},
            {"fieldname": "image", "label": "Image", "fieldtype": "Attach Image"},
            
            {"fieldname": "item", "label": "Linked Item", "fieldtype": "Link", "options": "Item", "read_only": 1, "hidden": 1}
        ],
        "permissions": [
            {"role": "System Manager", "read": 1, "write": 1, "create": 1, "delete": 1},
            {"role": "Pharmacist", "read": 1, "write": 1, "create": 1},
            {"role": "Pharmacy Manager", "read": 1, "write": 1, "create": 1, "delete": 1}
        ]
    })
    doc.insert()
    print("Medicine DocType created successfully")

def execute():
    frappe.flags.in_test = True # Bypass some validations if needed
    setup_naming_series()
    create_roles()
    create_medicine_doctype()
    frappe.db.commit()

