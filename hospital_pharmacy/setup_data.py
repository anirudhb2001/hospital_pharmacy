import frappe
from frappe.utils import today

def create_medicines():
    medicines_data = [
        {"name": "Paracetamol 500mg", "cat": "Tablet", "price": 2.5, "mrp": 3.0, "qty": 100},
        {"name": "Amoxicillin 250mg", "cat": "Capsule", "price": 5.0, "mrp": 6.5, "qty": 50},
        {"name": "Cough Syrup", "cat": "Syrup", "price": 45.0, "mrp": 55.0, "qty": 30},
        {"name": "Ibuprofen 400mg", "cat": "Tablet", "price": 4.0, "mrp": 5.0, "qty": 200},
        {"name": "Vitamin C 1000mg", "cat": "Tablet", "price": 10.0, "mrp": 12.0, "qty": 150},
        {"name": "Hydrocortisone Cream", "cat": "Cream", "price": 35.0, "mrp": 40.0, "qty": 20},
        {"name": "Saline Eye Drops", "cat": "Drops", "price": 25.0, "mrp": 30.0, "qty": 40},
        {"name": "Insulin Injection", "cat": "Injection", "price": 120.0, "mrp": 150.0, "qty": 10},
        {"name": "Antiseptic Ointment", "cat": "Ointment", "price": 15.0, "mrp": 20.0, "qty": 60},
        {"name": "Protein Powder", "cat": "Powder", "price": 350.0, "mrp": 400.0, "qty": 5},
    ]

    for med in medicines_data:
        if not frappe.db.exists("Medicine", {"medicine_name": med["name"]}):
            doc = frappe.get_doc({
                "doctype": "Medicine",
                "medicine_name": med["name"],
                "category": med["cat"],
                "purchase_price": med["price"] * 0.7,
                "selling_price": med["price"],
                "mrp": med["mrp"],
                "expiry_date": frappe.utils.add_days(today(), 365),
                "minimum_stock": 10,
                "maximum_stock": 500,
                "image": f"https://api.dicebear.com/7.x/shapes/svg?seed={med['name'].replace(' ', '')}"
            })
            doc.insert(ignore_permissions=True)
            frappe.db.commit()
            print(f"Created Medicine: {med['name']}")
            
            from hospital_pharmacy.hospital_pharmacy.doctype.medicine.medicine import add_stock
            add_stock(doc.name, med["qty"])
            frappe.db.commit()
            print(f"Added stock {med['qty']} for {med['name']}")
        else:
            print(f"Medicine {med['name']} already exists")
