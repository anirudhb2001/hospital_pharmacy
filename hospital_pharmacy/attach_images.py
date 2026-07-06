import os
import shutil
import frappe

def attach_images():
    frappe.init(site="hospital.com")
    frappe.connect()
    
    base_dir = "/home/anirudh-b/.gemini/antigravity/brain/0399e18a-c837-4e8e-90fc-17a9c62a5460/"
    dest_dir = "/home/anirudh-b/hospital-bench/sites/hospital.com/public/files/"
    
    mapping = {
        "Paracetamol 500mg": "paracetamol_1783334119173.png",
        "Amoxicillin 250mg": "amoxicillin_1783334128260.png",
        "Cough Syrup": "cough_syrup_1783334138931.png",
        "Ibuprofen 400mg": "ibuprofen_1783334148957.png",
        "Vitamin C 1000mg": "vitamin_c_1783334161032.png",
        "Hydrocortisone Cream": "hydrocortisone_1783334170617.png",
        "Saline Eye Drops": "eye_drops_1783334179945.png",
        "Insulin Injection": "insulin_1783334189462.png",
        "Antiseptic Ointment": "antiseptic_1783334199199.png",
        "Protein Powder": "protein_powder_1783334210059.png"
    }

    for medicine_name, img_file in mapping.items():
        src = os.path.join(base_dir, img_file)
        dest = os.path.join(dest_dir, img_file)
        
        if os.path.exists(src):
            shutil.copy2(src, dest)
            print(f"Copied {img_file}")
            
            # Update DB
            doc_name = frappe.db.get_value("Medicine", {"medicine_name": medicine_name}, "name")
            if doc_name:
                frappe.db.set_value("Medicine", doc_name, "image", f"/files/{img_file}")
                print(f"Updated {medicine_name}")
        else:
            print(f"Missing {src}")
            
    frappe.db.commit()
    frappe.destroy()

if __name__ == "__main__":
    attach_images()
