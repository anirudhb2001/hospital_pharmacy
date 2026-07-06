# Copyright (c) 2026, Hospital Pharmacy
# For license information, please see license.txt

import frappe

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        {
            "label": "Medicine Name",
            "fieldname": "medicine_name",
            "fieldtype": "Data",
            "width": 180,
        },
        {
            "label": "Available Stock",
            "fieldname": "available_stock",
            "fieldtype": "Float",
            "width": 120,
        },
        {
            "label": "Purchase Invoice",
            "fieldname": "purchase_invoice",
            "fieldtype": "Link",
            "options": "Purchase Invoice",
            "width": 180,
        },
        {
            "label": "Sales Invoice",
            "fieldname": "sales_invoice",
            "fieldtype": "Link",
            "options": "Sales Invoice",
            "width": 180,
        },
        {
            "label": "Supplier",
            "fieldname": "supplier",
            "fieldtype": "Link",
            "options": "Supplier",
            "width": 180,
        },
        {
            "label": "Customer",
            "fieldname": "customer",
            "fieldtype": "Link",
            "options": "Customer",
            "width": 180,
        },
        {
            "label": "Payment Status",
            "fieldname": "payment_status",
            "fieldtype": "Data",
            "width": 140,
        },
    ]

def get_data(filters):
    if not filters:
        filters = {}
        
    conditions = ""
    if filters.get("medicine"):
        conditions += " AND m.name = %(medicine)s"
        
    query = f"""
        SELECT 
            m.name as medicine_id,
            m.medicine_name,
            m.item,
            IFNULL((SELECT SUM(actual_qty) FROM tabBin WHERE item_code = m.item), 0) as available_stock
        FROM 
            tabMedicine m
        WHERE 1=1 {conditions}
    """
    
    medicines = frappe.db.sql(query, filters, as_dict=1)
    final_data = []
    
    for med in medicines:
        # Defaults
        med.purchase_invoice = ""
        med.supplier = ""
        med.sales_invoice = ""
        med.customer = ""
        med.payment_status = ""
        
        # Get Latest Purchase Invoice
        pi_data = frappe.db.sql("""
            SELECT pi.name as purchase_invoice, pi.supplier
            FROM `tabPurchase Invoice Item` pii
            JOIN `tabPurchase Invoice` pi ON pii.parent = pi.name
            WHERE pii.item_code = %s AND pi.docstatus = 1
            ORDER BY pi.posting_date DESC, pi.creation DESC
            LIMIT 1
        """, (med.item), as_dict=1)
        
        if pi_data:
            med.purchase_invoice = pi_data[0].purchase_invoice
            med.supplier = pi_data[0].supplier
            
        # Get Latest Sales Invoice
        si_data = frappe.db.sql("""
            SELECT si.name as sales_invoice, si.customer, si.status as payment_status
            FROM `tabSales Invoice Item` sii
            JOIN `tabSales Invoice` si ON sii.parent = si.name
            WHERE sii.item_code = %s AND si.docstatus = 1
            ORDER BY si.posting_date DESC, si.creation DESC
            LIMIT 1
        """, (med.item), as_dict=1)
        
        if si_data:
            med.sales_invoice = si_data[0].sales_invoice
            med.customer = si_data[0].customer
            med.payment_status = si_data[0].payment_status
            
        # Apply filters that are based on derived fields
        if filters.get("supplier") and med.supplier != filters.get("supplier"):
            continue
            
        if filters.get("customer") and med.customer != filters.get("customer"):
            continue
            
        if filters.get("payment_status") and med.payment_status != filters.get("payment_status"):
            continue
            
        final_data.append(med)
        
    return final_data