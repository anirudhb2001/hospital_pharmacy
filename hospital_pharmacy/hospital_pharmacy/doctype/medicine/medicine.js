// Copyright (c) 2026, Anirudh B and contributors
// For license information, please see license.txt

// Copyright (c) 2026, Anirudh B and contributors
// For license information, please see license.txt

frappe.ui.form.on("Medicine", {
	refresh(frm) {
		if (frm.doc.expiry_date && frappe.datetime.get_diff(frm.doc.expiry_date, frappe.datetime.get_today()) < 30) {
			frm.dashboard.add_comment("Warning", "This medicine is nearing expiry!", "red");
		}
		if (frm.doc.current_stock <= frm.doc.minimum_stock) {
			frm.dashboard.add_comment("Warning", "Low stock alert!", "orange");
		}
	},
	selling_price(frm) {
		if (frm.doc.selling_price && frm.doc.purchase_price && frm.doc.selling_price < frm.doc.purchase_price) {
			frappe.msgprint(__("Selling price shouldn't be less than purchase price."));
		}
	},
	expiry_date(frm) {
		if (frm.doc.expiry_date && frappe.datetime.get_diff(frm.doc.expiry_date, frappe.datetime.get_today()) < 0) {
			frappe.throw(__("Expiry date must be in the future."));
			frm.set_value("expiry_date", "");
		}
	}
});
