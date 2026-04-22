# 💊 MedSecure — Online Testing & Monitoring of Quality of Medicines and Consumables

> **Smart India Hackathon 2025** | Problem Statement ID: 1621 | Theme: MedTech / BioTech / HealthTech

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Usage](#usage)
- [Impact & Benefits](#impact--benefits)
- [Challenges & Solutions](#challenges--solutions)
- [References](#references)




---

## 🧾 About the Project

**MediVerify** is a unified, software-only platform designed to ensure the **real-time quality and authenticity of medicines and consumables** in hospitals and healthcare supply chains.

The platform tackles three critical problems:

- 🚫 **Counterfeit medicines** entering hospital supply chains via fake Batch IDs
- 🌡️ **Improper storage** of temperature-sensitive medicines (vaccines, insulin)
- 📋 **Lack of transparent, auditable** verification records

Our solution combines **OCR, Computer Vision, simulated IoT monitoring, and Blockchain** into a single, affordable, software-based pipeline — no expensive hardware required.

---

## ✨ Key Features

- **Bulk Verification** — Scan multiple medicines and consumables quickly during procurement or storage checks
- **OCR + Computer Vision** — Automatically reads expiry date, batch number, and manufacturer details from packaging; detects cracks, dents, seal breaks, and color mismatches
- **Simulated IoT Monitoring** — Virtually tracks storage conditions (temperature, humidity) to ensure cold-chain integrity for vaccines and insulin
- **Database Cross-Verification** — Compares extracted details against a trusted database to confirm batch validity
- **Blockchain Integration** — Stores all verification results on an immutable blockchain ledger, providing tamper-proof, auditable records
- **Hospital Dashboard** — Role-based login for hospital staff with verification status (✅ Safe / ❌ Unsafe) and full audit trail

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Tailwind CSS, HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js, Flask (API & processing) |
| **AI / ML** | TensorFlow, OpenCV, Tesseract.js |
| **Database** | MongoDB, MySQL |
| **Blockchain** | Polygon (testnet) |
| **Cloud Hosting** | AWS, Azure |

---

## 📸 Screenshots



| Starting | Verification  | Dashboard |
|-----------|-------------------|-----------------|
| <img width="1899" height="816" alt="Front" src="https://github.com/user-attachments/assets/63988b38-4d5e-4efb-b67a-93473b7aaae7" /> | <img width="1416" height="817" alt="verification" src="https://github.com/user-attachments/assets/0c8ee585-5ee4-442f-833f-00d1642fe678" /> <img width="970" height="807" alt="dashboard" src="https://github.com/user-attachments/assets/b66cd8b9-70d5-4ea7-bde1-457a7438600e" /> | <img width="1221" height="817" alt="dashboard2" src="https://github.com/user-attachments/assets/fdcb5144-a74a-4e48-9179-a50b5d141c7b" /> |


---
## 🏗️ System Architecture

```
Hospital Staff
     │
     ▼
Login / Register
     │
     ▼
Home Page → Start Verification
     │
     ├──► OCR (Batch No., Expiry, Manufacturer)
     │
     ├──► Computer Vision (Physical Damage Detection)
     │         └── Seal broke / Cracks / Dents / Colour mismatch
     │
     ├──► IoT Simulation (Cold-Chain Data)
     │         └── Temperature & Humidity for Vaccines, Insulin
     │
     ├──► Database Cross-Verification (MongoDB / MySQL)
     │
     └──► Blockchain Logging (Polygon)
               └── Immutable, tamper-proof record linked to staff identity
                         │
                         ▼
              Verification Result: ✅ SAFE / ❌ UNSAFE
```

---

## 📖 Usage

1. **Register / Login** as hospital staff
2. Navigate to **Start Verification**
3. Upload an image of the medicine/consumable packaging
4. The system will:
   - Extract batch number, expiry date, and manufacturer via OCR
   - Detect any physical damage via Computer Vision
   - Check storage condition flags via simulated IoT data
   - Cross-verify details against the database
5. View the **verification result** — Safe ✅ or Unsafe ❌
6. All results are **automatically logged to the blockchain** with your staff identity

---

## 🌍 Impact & Benefits

| Stakeholder | Benefit |
|---|---|
| **Hospitals & Health Systems** | Guarantees high-quality medicines, improves patient safety |
| **Pharmaceutical Suppliers** | Ensures products meet quality before reaching hospitals, reducing return rates |
| **Hospital Staff** | Reduces manual verification effort, saves time |
| **Regulators** | Tamper-proof blockchain logs for compliance auditing |
| **Society** | Safer healthcare, reduced counterfeit drug risks |

**Broader Impact:**
- 📉 Saves costs from drug recalls and counterfeit losses
- ♻️ Prevents wastage of temperature-sensitive products like vaccines and insulin
- 🇮🇳 Supports **Digital India** and **Ayushman Bharat** initiatives

---

## ⚙️ Challenges & Solutions

| Challenge | Our Approach |
|---|---|
| **Data Availability** — lack of real CDSCO datasets | Use mock databases & simulated IoT data; future integration with manufacturer database APIs |
| **CV/OCR Accuracy** — false positives in real-world scenarios | Basic models (Tesseract.js + OpenCV) for demo; improved accuracy via larger datasets and ML retraining |
| **Blockchain Overhead** — deployment costs on mainnet | Use Polygon testnet for now; future-ready for enterprise private blockchain |
| **User Adoption** — hospitals hesitant to change workflows | Simple, intuitive UI with minimal training required; demo dashboards for staff |

---

## 📚 References

- [Central Drugs Standard Control Organization (CDSCO), Govt. of India](https://cdsco.gov.in)
- [Pharmaceutical Security Institute (PSI) — Reports on Drug Counterfeiting](https://www.psi-inc.org)
- [Research Paper — Online Testing and Monitoring of Quality of Medicines and Consumables](https://share.google/BUuaTCdQzjfvbjUpB)
- [Research Paper — Computer Vision-Based Quality Assessment for Consumables (Elsevier)](https://www.elsevier.com/locate/eswa)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

