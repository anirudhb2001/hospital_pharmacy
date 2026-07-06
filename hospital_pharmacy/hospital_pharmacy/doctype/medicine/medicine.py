# Copyright (c) 2026, Anirudh B and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate

class Medicine(Document):
	def validate(self):
		self.validate_prices()
		self.validate_expiry()
		
	def before_save(self):
		self.sync_with_item()

	def validate_prices(self):
		if self.selling_price and self.purchase_price and self.selling_price < self.purchase_price:
			frappe.throw("Selling price cannot be lower than purchase price")

	def validate_expiry(self):
		if self.expiry_date and getdate(self.expiry_date) < getdate():
			frappe.throw("Expiry date must be in the future")

	def sync_with_item(self):
		self.ensure_item_group()
		if not self.item:
			item_code = self.name if self.name else frappe.generate_hash(length=10)
			item = frappe.get_doc({
				"doctype": "Item",
				"item_code": item_code,
				"item_name": self.medicine_name,
				"item_group": "Medicine",
				"stock_uom": self.unit or "Nos",
				"is_stock_item": 1,
				"has_batch_no": 1 if self.batch_number else 0,
				"create_new_batch": 1 if self.batch_number else 0,
				"valuation_rate": self.purchase_price,
				"standard_rate": self.selling_price,
				"description": self.description,
			})
			item.flags.ignore_permissions = True
			item.insert(ignore_mandatory=True)
			self.item = item.name
		else:
			item = frappe.get_doc("Item", self.item)
			item.item_name = self.medicine_name
			item.valuation_rate = self.purchase_price
			item.standard_rate = self.selling_price
			item.description = self.description
			item.flags.ignore_permissions = True
			item.save(ignore_mandatory=True)
			
	def ensure_item_group(self):
		if not frappe.db.exists("Item Group", "Medicine"):
			parent = frappe.db.get_value("Item Group", {"is_group": 1}, "name")
			frappe.get_doc({
				"doctype": "Item Group",
				"item_group_name": "Medicine",
				"parent_item_group": parent
			}).insert(ignore_permissions=True)
