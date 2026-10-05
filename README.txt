# BhuRakshak — Intelligent Land Record Digitization & Validation System

BhuRakshak is a web-based land record digitization and validation platform designed to provide a structured workflow for land-record submission, document processing, human verification, digital document generation, QR-based verification, and GIS-assisted record access.

The system provides dedicated workflows for users, officers, and administrators while using MongoDB as the primary persistence layer.

> **Project Status:** Working Prototype / Hackathon Demonstration  
> This project is intended for educational, technical, and demonstration purposes and does not represent an official government land-record service.

---

## Overview

Traditional land records may exist in different physical and digital formats, making their organization, verification, and accessibility difficult.

BhuRakshak demonstrates a centralized workflow where:

1. A user registers and verifies their account.
2. The user submits land and applicant information.
3. Supporting documents can be uploaded and processed.
4. Submitted records enter the verification workflow.
5. An authorized officer reviews the record and supporting information.
6. The officer can verify or reject the record.
7. A verified record can generate a digital land-record document.
8. The generated document includes QR-based verification.
9. Verified records can be accessed through the available GIS/record-search workflow.

---

# Key Features

## User Module

- User registration
- User login
- Phone and email verification
- Land record submission
- Applicant information
- Parent information
- Property and land information
- Registration information
- Supporting document upload
- Record status tracking
- Verified record access

## Document Processing

- Supporting document upload
- OCR-assisted text extraction
- English document processing
- Hindi OCR support where configured
- Extracted information can be reviewed during the verification process
- Automatic extraction failures can fall back to manual review

## Officer Verification

Authorized officers can:

- Access the officer dashboard
- View submitted land records
- Review applicant information
- Review property information
- Review uploaded supporting documents
- Check extracted information
- Verify records
- Reject records
- Open generated digital documents for verified records

The verification workflow is based on the submitted record and supporting evidence rather than a separate record-view password.

## Administrator Module

The administrator dashboard provides system-level monitoring capabilities including:

- Total records
- Pending records
- Verified records
- Generated/uploaded document statistics
- Record management
- Administrative authentication
- Administrative verification workflows

Administrator authentication includes additional verification mechanisms for improved account security.

## Digital Document Generation

A digital record document is generated from the verified MongoDB record.

The generated document can contain:

- Record ID
- Applicant information
- Parent information
- Land/property information
- Registration information
- Relevant government/state branding assets where available
- QR-based verification information
- Prototype/reference notice

Empty or unavailable fields are omitted where applicable.

Cadastral maps/naksha and unnecessary supporting-document listings are not included in the generated digital document.

## QR Verification

Verified digital documents include a QR code.

Depending on the deployment configuration:

- A public verification URL can be encoded in the QR code.
- In local/demo configuration, verified record information can be encoded without exposing a localhost address.

The verification workflow allows a scanned QR code to open the corresponding verified record information.

## GIS / Record Search

The GIS/record-search workflow supports searching available verified records using record and location information such as:

- Record ID
- State
- District
- Village
- Khesara
- Survey information
- Khata
- Khatiyan

Only appropriate verified-record information is exposed through the public verification workflow.

---

# Application Workflow

```text
                    BhuRakshak
                        │
                        ▼
                User Registration
                        │
                        ▼
                 Account Verification
                        │
                        ▼
                    User Login
                        │
                        ▼
              Land Record Submission
                        │
                        ▼
             Supporting Documents
                        │
                        ▼
              OCR / Data Processing
                        │
                        ▼
               Pending Verification
                        │
                        ▼
                 Officer Review
                   /         \
                  /           \
             Reject           Verify
               │                │
               ▼                ▼
          Rejected Record   Digital Document
                                │
                                ▼
                          QR Verification
                                │
                                ▼
                         GIS / Record Access
