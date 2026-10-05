"use strict";

/* =====================================================
   BHURAKSHAK - CORRECTED FRONTEND
===================================================== */

const $ = id => document.getElementById(id);

let landMap = null;
let mapMarker = null;
let currentExtractedFields = {};
let currentRecordId = null;
let currentLanguage = localStorage.getItem("bhurakshak-language") || "en";


/* =====================================================
   BILINGUAL UI - ENGLISH / HINDI
===================================================== */

const translations = {
    en: {
        home:"Home", login:"Login", officerLogin:"Officer Login", phoneNumber:"Phone Number", sendPhoneOtp:"Send Phone OTP", sendEmailOtp:"Send Email OTP", verifyOtp:"Verify", createAccount:"Create Account", digitize:"Digitize Record", records:"Land Records", gis:"GIS Map", verification:"Verification", validation:"Validation", audit:"Audit Trail", analytics:"Analytics", support:"Customer Support",
        hero1:"From Paper", hero2:"to Trusted Digital Land Records", heroDesc:"BhuRakshak is an AI-powered platform for digitizing legacy land records, extracting structured information, validating records, detecting duplicates and connecting records with GIS intelligence.",
        digitizeNew:"Digitize New Record", exploreGIS:"Explore India GIS", ocrAccuracy:"AI OCR Accuracy", languages:"Indian Languages", recordsDigitized:"Records Digitized", legacyProcessed:"Legacy records processed", extractionAccuracy:"AI EXTRACTION ACCURACY", averageConfidence:"Average field confidence", verificationQueue:"VERIFICATION QUEUE", awaitingReview:"Awaiting officer review", duplicateAlerts:"DUPLICATE ALERTS", possibleDuplicates:"Possible duplicates",
        workflow:"INTELLIGENT WORKFLOW", workflowTitle:"From paper to trusted digital record", workflowDesc:"Every stage is connected through one intelligent workflow.", upload:"Upload", uploadDesc:"Scanned PDF, image or handwritten document", validate:"Validate", validateDesc:"Rules, duplicates and cross verification", verify:"Verify", verifyDesc:"Human review for uncertain fields", integrate:"Integrate", integrateDesc:"LRMS, DILRMP and GIS-ready records",
        citizenSupport:"CITIZEN & OFFICER SUPPORT", needHelp:"Need help with a land record?", supportDesc:"Raise a support request for digitization, verification, record search or technical assistance.",
        documentProcessing:"AI DOCUMENT PROCESSING", digitizeTitle:"Digitize New Land Record", digitizeDesc:"Upload a scanned document, image or handwritten record.", dropDocument:"Drop document here", fileTypes:"PDF, JPG, JPEG or PNG • Maximum 20 MB", chooseFile:"Choose File", documentLanguage:"Document Language", recordType:"Record Type", startExtraction:"Start AI Extraction", processingPipeline:"Processing Pipeline", extractedRecord:"Extracted Land Record", saveDraft:"Save Draft", submitVerification:"Submit for Verification", landRecords:"Land Records", searchRecords:"Search digitized land records.", addRecord:"Add Record", allStatus:"All Status", verified:"Verified", pending:"Pending", flagged:"Flagged", gisTitle:"India Land Parcel GIS", gisDesc:"Search any Indian state, district, city or village.", verificationTitle:"Verification Queue", verificationDesc:"Officer review for uncertain records.", validationTitle:"Validation Center", validationDesc:"Automated business rules, duplicate detection and cross-record checks.", auditTitle:"Audit Trail", auditDesc:"Track every important record operation.", analyticsTitle:"Analytics Dashboard", analyticsDesc:"Monitor digitization and AI performance.", waiting:"Waiting", imagePreprocessing:"Image preprocessing", preprocessDesc:"Deskew, denoise & enhance", ocrExtraction:"AI-OCR extraction", ocrTextDesc:"Printed + handwritten text", fieldClassification:"Field classification", fieldMappingDesc:"Land record field mapping", validationEngine:"Validation engine", validationDescShort:"Rules + duplicate checks", humanVerification:"Human verification", humanVerificationDesc:"Route uncertain fields", recordId:"Record ID", landowner:"Landowner", khasra:"Khesara", area:"Area", location:"Location", status:"Status", confidence:"Confidence", action:"Action", hindi:"Hindi", english:"English", preprocessing:"Preprocessing", validationStatus:"Validation", completed:"Completed", failed:"Failed", extracting:"AI Extracting...", ocrStatus:"OCR extraction", classificationStatus:"Field classification", landSubmission:"LAND RECORD SUBMISSION", formTitle:"User & Land Information", formDesc:"Fill applicant, land, parent and supporting document information.", applicantInfo:"Applicant Information", fullName:"Full Name", mobileNumber:"Mobile Number", email:"Email", idAadhaarLast4:"ID / Aadhaar Last 4 Digits", landInformation:"Land Information", state:"State", district:"District", khatiyanNumber:"Khatiyan / Jamabandi Number", revenueThana:"Revenue Thana", ward:"Ward", address:"Full Address", landBoundaries:"Land Boundaries / Chauhaddi", addressProof:"Address Proof", addressProofHelp:"Upload Aadhaar, utility bill, residence certificate or another valid address proof.", boundaryEast:"East", boundaryWest:"West", boundaryNorth:"North", boundarySouth:"South", pinCode:"PIN Code", tehsilTaluk:"Tehsil / Taluk", village:"Village", khasraSurvey:"Khesara / Survey Number", khataKhatauni:"Khata / Khatauni Number", landType:"Land Type", ownershipType:"Ownership Type", registrationId:"Registration ID", fatherMother:"Parent Details", fatherName:"Father Name", motherName:"Mother Name", fatherIdLast4:"Father Aadhaar Last 4 Digits", motherIdLast4:"Mother ID Last 4 Digits", supportingDocs:"Supporting Documents", primaryLandRecord:"Primary Land Record / Deed *", applicantIdProof:"Applicant ID Proof *", fatherIdProof:"Parent 1 ID Proof *", motherIdProof:"Parent 2 ID Proof *", registryDeed:"Registry / Sale Deed", khatauniRor:"Khatauni / Jamabandi / RoR", mutationIntkal:"Mutation / Intkal", inheritanceProof:"Inheritance / Legal-Heir Proof", otherDocument:"Other Supporting Document", cancel:"Cancel", saveCheck:"Save & Check", placeholderFullName:"Enter full name", placeholderMobile:"Enter mobile number", placeholderEmail:"Enter email address", placeholderLast4:"Enter last 4 digits", placeholderArea:"Example: 2.46 Hectare", placeholderLandType:"Agricultural / Residential", placeholderOwnership:"Individual / Joint / Inherited", placeholderAddress:"House / Street / Village / Post / District / State / PIN", validationPopupTitle:"Required details missing", validationPopupMessage:"Please fill all required details before submitting.", okay:"OK", invalidNumber:"Only numbers are allowed.", invalidName:"Numbers are not allowed in name fields.", submitSuccess:"Record submitted successfully for verification.", search:"Search", documentRequirementsNote:"Document requirements vary by state and land transaction. Available documents are optional for submission.", selectLandType:"Select Land Type", agricultural:"Agricultural", residential:"Residential", commercial:"Commercial", industrial:"Industrial", government:"Government", marathi:"Marathi", bengali:"Bengali", tamil:"Tamil", telugu:"Telugu", kannada:"Kannada", gujarati:"Gujarati", landOwnershipRecord:"Land Ownership Record", mutationRecord:"Mutation Record", registrationRecord:"Registration Record", cadastralRecord:"Cadastral Record", selectMutationStatus:"Select Mutation Status", mutationNotApplied:"Not Applied", mutationPending:"Pending", mutationUnderProcess:"Under Process", mutationApproved:"Approved / Registered", mutationRejected:"Rejected", mutationNotAvailable:"Not Available", secureLogin:"Secure Login →", forgotPassword:"Forgot password?", passwordRecovery:"PASSWORD RECOVERY", forgotPasswordTitle:"Forgot Password", forgotPasswordDesc:"Reset your administrator password using your registered phone number or email.", loginIdentifier:"Phone / Email / User ID", sendResetOtp:"Send Reset OTP", resetOtp:"Reset OTP", newPassword:"New Password", confirmPassword:"Confirm Password", resetPassword:"Reset Password", digitalRepository:"DIGITAL REPOSITORY", gisSearchPlaceholder:"Search Record ID, owner, village or Khesara", selectState:"Select State / UT", selectDistrict:"Select District", villageMouzaPlaceholder:"Village / Mouza", circleAnchalPlaceholder:"Circle / Anchal", khesaraSurveyPlaceholder:"Khesara / Survey No.", verifiedLegend:"🟢 Verified", pendingLegend:"🟠 Pending", alertLegend:"🔴 Alert"
    },
    hi: {
        home:"होम", login:"लॉगिन", officerLogin:"अधिकारी लॉगिन", phoneNumber:"मोबाइल नंबर", sendPhoneOtp:"फोन OTP भेजें", sendEmailOtp:"ईमेल OTP भेजें", verifyOtp:"सत्यापित करें", createAccount:"खाता बनाएँ", digitize:"रिकॉर्ड डिजिटाइज़ करें", records:"भूमि रिकॉर्ड", gis:"GIS मानचित्र", verification:"सत्यापन", validation:"वैलिडेशन", audit:"ऑडिट ट्रेल", analytics:"एनालिटिक्स", support:"ग्राहक सहायता",
        hero1:"कागज़ी रिकॉर्ड से", hero2:"विश्वसनीय डिजिटल भूमि रिकॉर्ड तक", heroDesc:"BhuRakshak एक AI-आधारित प्लेटफ़ॉर्म है जो पुराने भूमि रिकॉर्ड को डिजिटल करता है, संरचित जानकारी निकालता है, रिकॉर्ड का सत्यापन करता है, डुप्लिकेट पहचानता है और GIS से जोड़ता है।",
        digitizeNew:"नया रिकॉर्ड डिजिटाइज़ करें", exploreGIS:"भारत GIS देखें", ocrAccuracy:"AI OCR सटीकता", languages:"भारतीय भाषाएँ", recordsDigitized:"डिजिटाइज़ किए गए रिकॉर्ड", legacyProcessed:"प्रोसेस किए गए पुराने रिकॉर्ड", extractionAccuracy:"AI EXTRACTION सटीकता", averageConfidence:"औसत फ़ील्ड विश्वसनीयता", verificationQueue:"सत्यापन कतार", awaitingReview:"अधिकारी समीक्षा की प्रतीक्षा", duplicateAlerts:"डुप्लिकेट अलर्ट", possibleDuplicates:"संभावित डुप्लिकेट",
        workflow:"स्मार्ट वर्कफ़्लो", workflowTitle:"कागज़ से विश्वसनीय डिजिटल रिकॉर्ड तक", workflowDesc:"हर चरण एक ही इंटेलिजेंट वर्कफ़्लो से जुड़ा है।", upload:"अपलोड", uploadDesc:"स्कैन किया हुआ PDF, इमेज या हस्तलिखित दस्तावेज़", validate:"वैलिडेट", validateDesc:"नियम, डुप्लिकेट और क्रॉस-वेरिफिकेशन", verify:"सत्यापित करें", verifyDesc:"अनिश्चित फ़ील्ड की मानव समीक्षा", integrate:"इंटीग्रेट", integrateDesc:"LRMS, DILRMP और GIS के लिए तैयार रिकॉर्ड",
        citizenSupport:"नागरिक और अधिकारी सहायता", needHelp:"भूमि रिकॉर्ड में सहायता चाहिए?", supportDesc:"डिजिटाइज़ेशन, सत्यापन, रिकॉर्ड खोज या तकनीकी सहायता के लिए अनुरोध भेजें।",
        documentProcessing:"AI DOCUMENT PROCESSING", digitizeTitle:"नया भूमि रिकॉर्ड डिजिटाइज़ करें", digitizeDesc:"स्कैन किया हुआ दस्तावेज़, इमेज या हस्तलिखित रिकॉर्ड अपलोड करें।", dropDocument:"दस्तावेज़ यहाँ छोड़ें", fileTypes:"PDF, JPG, JPEG या PNG • अधिकतम 20 MB", chooseFile:"फ़ाइल चुनें", documentLanguage:"दस्तावेज़ की भाषा", recordType:"रिकॉर्ड का प्रकार", startExtraction:"AI Extraction शुरू करें", processingPipeline:"प्रोसेसिंग पाइपलाइन", extractedRecord:"निकाला गया भूमि रिकॉर्ड", saveDraft:"ड्राफ्ट सेव करें", submitVerification:"सत्यापन के लिए भेजें", landRecords:"भूमि रिकॉर्ड", searchRecords:"डिजिटाइज़ किए गए भूमि रिकॉर्ड खोजें।", addRecord:"रिकॉर्ड जोड़ें", allStatus:"सभी स्थिति", verified:"सत्यापित", pending:"लंबित", flagged:"फ़्लैग किया गया", gisTitle:"भारत भूमि पार्सल GIS", gisDesc:"कोई भी भारतीय राज्य, ज़िला, शहर या गाँव खोजें।", verificationTitle:"सत्यापन कतार", verificationDesc:"अनिश्चित रिकॉर्ड की अधिकारी समीक्षा।", validationTitle:"वैलिडेशन सेंटर", validationDesc:"स्वचालित नियम, डुप्लिकेट पहचान और क्रॉस-रिकॉर्ड जाँच।", auditTitle:"ऑडिट ट्रेल", auditDesc:"हर महत्वपूर्ण रिकॉर्ड गतिविधि को ट्रैक करें।", analyticsTitle:"एनालिटिक्स डैशबोर्ड", analyticsDesc:"डिजिटाइज़ेशन और AI प्रदर्शन की निगरानी करें।", waiting:"प्रतीक्षा", imagePreprocessing:"इमेज प्रीप्रोसेसिंग", preprocessDesc:"टेढ़ापन सुधारें, शोर हटाएँ और इमेज बेहतर करें", ocrExtraction:"AI-OCR एक्सट्रैक्शन", ocrTextDesc:"प्रिंटेड और हस्तलिखित टेक्स्ट", fieldClassification:"फ़ील्ड वर्गीकरण", fieldMappingDesc:"भूमि रिकॉर्ड फ़ील्ड मैपिंग", validationEngine:"वैलिडेशन इंजन", validationDescShort:"नियम और डुप्लिकेट जाँच", humanVerification:"मानव सत्यापन", humanVerificationDesc:"अनिश्चित फ़ील्ड सत्यापन के लिए भेजें", recordId:"रिकॉर्ड ID", landowner:"भूमि मालिक", khasra:"खेसरा", area:"क्षेत्रफल", location:"स्थान", status:"स्थिति", confidence:"विश्वसनीयता", action:"कार्रवाई", hindi:"हिंदी", english:"अंग्रेज़ी", preprocessing:"प्रीप्रोसेसिंग", validationStatus:"वैलिडेशन", completed:"पूरा हुआ", failed:"विफल", extracting:"AI एक्सट्रैक्शन चल रहा है...", ocrStatus:"OCR एक्सट्रैक्शन", classificationStatus:"फ़ील्ड वर्गीकरण", landSubmission:"भूमि रिकॉर्ड जमा करना", formTitle:"उपयोगकर्ता और भूमि की जानकारी", formDesc:"आवेदक, भूमि, माता-पिता और सहायक दस्तावेज़ की जानकारी भरें।", applicantInfo:"आवेदक की जानकारी", fullName:"पूरा नाम", mobileNumber:"मोबाइल नंबर", email:"ईमेल", idAadhaarLast4:"ID / आधार के अंतिम 4 अंक", landInformation:"भूमि की जानकारी", state:"राज्य", district:"ज़िला", khatiyanNumber:"खतियान / जमाबंदी संख्या", revenueThana:"राजस्व थाना", ward:"वार्ड", address:"पूरा पता", landBoundaries:"भूमि की चौहद्दी", addressProof:"पता प्रमाण", addressProofHelp:"आधार, उपयोगिता बिल, निवास प्रमाण पत्र या अन्य वैध पता प्रमाण अपलोड करें।", boundaryEast:"पूर्व", boundaryWest:"पश्चिम", boundaryNorth:"उत्तर", boundarySouth:"दक्षिण", pinCode:"पिन कोड", tehsilTaluk:"तहसील / तालुक", village:"गाँव", khasraSurvey:"खेसरा / सर्वे नंबर", khataKhatauni:"खाता / खतौनी नंबर", landType:"भूमि का प्रकार", ownershipType:"स्वामित्व का प्रकार", registrationId:"पंजीकरण ID", fatherMother:"अभिभावक का विवरण", fatherName:"पिता का नाम", motherName:"माता का नाम", fatherIdLast4:"पिता के आधार के अंतिम 4 अंक", motherIdLast4:"माता के ID के अंतिम 4 अंक", supportingDocs:"सहायक दस्तावेज़", primaryLandRecord:"मुख्य भूमि रिकॉर्ड / डीड *", applicantIdProof:"आवेदक का ID प्रमाण *", fatherIdProof:"अभिभावक 1 का ID प्रमाण *", motherIdProof:"अभिभावक 2 का ID प्रमाण *", registryDeed:"रजिस्ट्री / बिक्री डीड", khatauniRor:"खतौनी / जमाबंदी / RoR", mutationIntkal:"म्यूटेशन / इंतकाल", inheritanceProof:"विरासत / कानूनी उत्तराधिकारी प्रमाण", otherDocument:"अन्य सहायक दस्तावेज़", cancel:"रद्द करें", saveCheck:"सेव करें और जाँचें", placeholderFullName:"पूरा नाम दर्ज करें", placeholderMobile:"मोबाइल नंबर दर्ज करें", placeholderEmail:"ईमेल दर्ज करें", placeholderLast4:"अंतिम 4 अंक दर्ज करें", placeholderArea:"उदाहरण: 2.46 हेक्टेयर", placeholderLandType:"कृषि / आवासीय", placeholderOwnership:"व्यक्तिगत / संयुक्त / विरासत में प्राप्त", placeholderAddress:"मकान / गली / गाँव / डाक / ज़िला / राज्य / पिन", validationPopupTitle:"आवश्यक जानकारी अधूरी है", validationPopupMessage:"सबमिट करने से पहले सभी आवश्यक जानकारी भरें।", okay:"ठीक है", invalidNumber:"केवल नंबर दर्ज करें।", invalidName:"नाम के फ़ील्ड में नंबर की अनुमति नहीं है।", submitSuccess:"रिकॉर्ड सत्यापन के लिए सफलतापूर्वक भेज दिया गया है।", search:"खोजें", documentRequirementsNote:"दस्तावेज़ की आवश्यकताएँ राज्य और भूमि लेन-देन के अनुसार अलग हो सकती हैं। उपलब्ध दस्तावेज़ जमा करने के लिए वैकल्पिक हैं।", selectLandType:"भूमि का प्रकार चुनें", agricultural:"कृषि", residential:"आवासीय", commercial:"वाणिज्यिक", industrial:"औद्योगिक", government:"सरकारी", marathi:"मराठी", bengali:"बंगाली", tamil:"तमिल", telugu:"तेलुगु", kannada:"कन्नड़", gujarati:"गुजराती", landOwnershipRecord:"भूमि स्वामित्व रिकॉर्ड", mutationRecord:"म्यूटेशन रिकॉर्ड", registrationRecord:"पंजीकरण रिकॉर्ड", cadastralRecord:"कैडस्ट्रल रिकॉर्ड", selectMutationStatus:"म्यूटेशन स्थिति चुनें", mutationNotApplied:"आवेदन नहीं किया गया", mutationPending:"लंबित", mutationUnderProcess:"प्रक्रिया में", mutationApproved:"स्वीकृत / दर्ज", mutationRejected:"अस्वीकृत", mutationNotAvailable:"उपलब्ध नहीं", secureLogin:"सुरक्षित लॉगिन →", forgotPassword:"पासवर्ड भूल गए?", passwordRecovery:"पासवर्ड पुनर्प्राप्ति", forgotPasswordTitle:"पासवर्ड भूल गए", forgotPasswordDesc:"पंजीकृत मोबाइल नंबर या ईमेल से प्रशासक पासवर्ड रीसेट करें।", loginIdentifier:"मोबाइल / ईमेल / यूज़र ID", sendResetOtp:"रीसेट OTP भेजें", resetOtp:"रीसेट OTP", newPassword:"नया पासवर्ड", confirmPassword:"पासवर्ड की पुष्टि करें", resetPassword:"पासवर्ड रीसेट करें", digitalRepository:"डिजिटल रिकॉर्ड भंडार", gisSearchPlaceholder:"रिकॉर्ड ID, नाम, गाँव या खेसरा खोजें", selectState:"राज्य / केंद्रशासित प्रदेश चुनें", selectDistrict:"ज़िला चुनें", villageMouzaPlaceholder:"गाँव / मौजा", circleAnchalPlaceholder:"सर्किल / अंचल", khesaraSurveyPlaceholder:"खेसरा / सर्वे नंबर", verifiedLegend:"🟢 सत्यापित", pendingLegend:"🟠 लंबित", alertLegend:"🔴 अलर्ट"
    }
};

function t(key) { return translations[currentLanguage]?.[key] ?? translations.en[key] ?? key; }

// All interactive popups/toasts use this dictionary so the selected UI
// language is respected consistently (English or Hindi).
const uiMessages = {
    uploadDocument: { en: "Please upload a document first.", hi: "कृपया पहले कोई दस्तावेज़ अपलोड करें।" },
    invalidFileType: { en: "Only PDF, JPG, JPEG, and PNG files are allowed.", hi: "केवल PDF, JPG, JPEG और PNG फ़ाइलें ही मान्य हैं।" },
    fileTooLarge: { en: "The document must be smaller than 20 MB.", hi: "दस्तावेज़ का आकार 20 MB से कम होना चाहिए।" },
    extractionNoFields: { en: "The document was read, but no land-record fields could be identified. Please enter the details manually.", hi: "दस्तावेज़ पढ़ लिया गया, लेकिन भूमि रिकॉर्ड की जानकारी नहीं मिली। कृपया विवरण स्वयं भरें।" },
    extractionSuccess: { en: count => `${count} field(s) were extracted by AI/OCR. Please verify them before submitting.`, hi: count => `AI/OCR द्वारा ${count} फ़ील्ड निकाली गई हैं। सबमिट करने से पहले उनकी जाँच करें।` },
    invalidJson: { en: "The server returned an invalid response. Please try again.", hi: "सर्वर से सही प्रतिक्रिया नहीं मिली। कृपया दोबारा प्रयास करें।" },
    saveFailed: { en: "The record could not be saved.", hi: "रिकॉर्ड सेव नहीं हो सका।" },
    requiredDocuments: { en: "Please attach all 4 required documents before submitting.", hi: "सबमिट करने से पहले सभी 4 आवश्यक दस्तावेज़ संलग्न करें।" },
    draftSaved: { en: "The user information has been saved as a draft.", hi: "उपयोगकर्ता की जानकारी ड्राफ्ट के रूप में सेव हो गई है।" },
    databaseSaved: { en: "The land record has been saved to the database successfully.", hi: "भूमि रिकॉर्ड डेटाबेस में सफलतापूर्वक सेव हो गया है।" },
    databaseFailed: { en: "The record could not be saved to the database.", hi: "रिकॉर्ड डेटाबेस में सेव नहीं हो सका।" },
    locationRequired: { en: "Please enter a state, district, or village before searching.", hi: "खोजने से पहले राज्य, ज़िला या गाँव दर्ज करें।" },
    locationSelected: { en: "Location selected. Please complete the user details.", hi: "स्थान चुना गया है। कृपया उपयोगकर्ता की जानकारी पूरी करें।" },
    locationSearchFailed: { en: "Location search failed. Please try again.", hi: "स्थान खोजने में समस्या हुई। कृपया दोबारा प्रयास करें।" },
    rejectReason: { en: "A rejection reason is required.", hi: "अस्वीकृति का कारण दर्ज करना आवश्यक है।" },
    currentLocationUnsupported: { en: "Current location is not supported by this browser.", hi: "यह ब्राउज़र वर्तमान स्थान की सुविधा का समर्थन नहीं करता।" },
    currentLocationSelected: { en: "Current location selected.", hi: "वर्तमान स्थान चुना गया है।" },
    supportSubmitted: { en: "Your support request has been submitted.", hi: "आपका सहायता अनुरोध सफलतापूर्वक भेज दिया गया है।" },
    localDraftSaved: { en: "The AI output has been saved as a local draft.", hi: "AI से निकाला गया डेटा स्थानीय ड्राफ्ट के रूप में सेव हो गया है।" },
    extractingFailed: { en: "AI document extraction failed. Please try again.", hi: "AI दस्तावेज़ एक्सट्रैक्शन विफल हुआ। कृपया दोबारा प्रयास करें।" },
    saveFailedGeneric: { en: "Record save failed. Please try again.", hi: "रिकॉर्ड सेव नहीं हो सका। कृपया दोबारा प्रयास करें।" },
    otpSentPhone: { en: "A separate 6-digit phone OTP has been generated.", hi: "अलग 6 अंकों का फोन OTP बनाया गया है।" },
    otpSentEmail: { en: "A separate 6-digit email OTP has been generated.", hi: "अलग 6 अंकों का ईमेल OTP बनाया गया है।" },
    otpVerifiedPhone: { en: "Phone number verified successfully.", hi: "मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया है।" },
    otpVerifiedEmail: { en: "Email verified successfully.", hi: "ईमेल सफलतापूर्वक सत्यापित हो गया है।" },
};

function msg(key, ...args) {
    const value = uiMessages[key];
    if (!value) return key;
    const selected = value[currentLanguage] ?? value.en;
    return typeof selected === "function" ? selected(...args) : selected;
}


async function parseApiResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        const data = await response.json();
        return { data, rawText: "" };
    }

    const rawText = await response.text();
    return { data: null, rawText };
}

function localizeServerMessage(message, data = {}) {
    const text = String(message || "").trim();
    if (data.code === "REQUIRED_DOCUMENT_MISSING" || /is required before submission/i.test(text)) {
        return currentLanguage === "hi"
            ? "सबमिट करने से पहले सभी 4 आवश्यक दस्तावेज़ संलग्न करें।"
            : "Please attach all 4 required documents before submitting.";
    }
    if (/is required\.?$/i.test(text)) {
        return currentLanguage === "hi"
            ? "कृपया सभी आवश्यक जानकारी भरें।"
            : "Please complete all required information.";
    }
    return text || msg("saveFailedGeneric");
}

function applyLanguage(lang = "en") {
    lang = lang === "hi" ? "hi" : "en";
    const dict = translations[lang];
    currentLanguage = lang;
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (dict[key] !== undefined) el.placeholder = dict[key];
    });
    document.querySelectorAll(".lang[data-lang]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
        btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });
    localStorage.setItem("bhurakshak-language", lang);
    return lang;
}

function initLanguageSwitcher() {
    document.querySelectorAll(".lang[data-lang]").forEach(btn => {
        btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
    });
    applyLanguage(localStorage.getItem("bhurakshak-language") || "en");
}

function showToast(message, type = "info") {
    const container = $("toastContainer");
    if (!container) {
        alert(message);
        return;
    }
    const toast = document.createElement("div");
    const icons = { success: "✓", error: "!", info: "i", warning: "!" };
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || "i"}</span><span class="toast-message">${escapeHTML(message)}</span><button class="toast-close" type="button" aria-label="Close">×</button>`;
    toast.querySelector(".toast-close")?.addEventListener("click", () => toast.remove());
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 220); }, 4200);
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active-page"));
    const page = $(pageId);
    if (page) page.classList.add("active-page");

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.toggle("active", item.dataset.page === pageId);
    });

    if (pageId === "gis") {
        setTimeout(() => {
            initializeMap();
            landMap?.invalidateSize();
        }, 100);
    }
    const protectedPages = ["verification", "validation", "audit", "analytics"];
    if (protectedPages.includes(pageId) && !getStaffToken()) {
        handleStaffRequired();
        return;
    }
    if (pageId === "records" || pageId === "verification") {
        loadRecords();
        loadStats();
    }
    if (pageId === "validation") loadValidationAnalysis();
    if (pageId === "audit") loadAuditTrail();
    if (pageId === "analytics") loadAnalytics();

    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(id) {
    $(id)?.classList.add("open");
}

function closeModal(id) {
    $(id)?.classList.remove("open");
    if (id === "formValidationModal") {
        $(id)?.setAttribute("aria-hidden", "true");
    }
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =====================================================
   MAP
===================================================== */

function initializeMap() {
    if (landMap || !window.L || !$("landMap")) return;

    landMap = L.map("landMap").setView([22.9734, 78.6569], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
    }).addTo(landMap);

    setTimeout(() => landMap?.invalidateSize(), 300);
}

async function searchMap() {
    const query = $("mapSearch")?.value.trim();

    if (!query) {
        showToast(msg("locationRequired"), "error");
        return;
    }

    try {
        showToast(currentLanguage === "hi" ? "स्थान खोजा जा रहा है..." : "Searching for location...");

        const url =
            "https://nominatim.openstreetmap.org/search" +
            "?format=json&addressdetails=1&limit=1&countrycodes=in&q=" +
            encodeURIComponent(query);

        const response = await fetch(url, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error("Location search failed.");

        const data = await response.json();
        if (!data.length) {
            showToast(currentLanguage === "hi" ? "स्थान नहीं मिला।" : "Location not found.", "error");
            return;
        }

        const result = data[0];
        const latitude = Number(result.lat);
        const longitude = Number(result.lon);

        initializeMap();
        landMap.setView([latitude, longitude], 14);

        if (mapMarker) mapMarker.remove();

        mapMarker = L.marker([latitude, longitude])
            .addTo(landMap)
            .bindPopup(escapeHTML(result.display_name))
            .openPopup();

        const address = result.address || {};
        openUserInformation({
            state: address.state || "",
            district: address.state_district || address.district || address.county || "",
            tehsil: address.tehsil || address.suburb || address.block || "",
            village: address.village || address.hamlet || address.town || address.city || ""
        });

        if ($("selectedLocation")) {
            $("selectedLocation").textContent = result.display_name;
        }

        showToast(msg("locationSelected"), "success");
    } catch (error) {
        console.error("MAP ERROR:", error);
        showToast(error.message || msg("locationSearchFailed"), "error");
    }
}

/* =====================================================
   USER FORM
===================================================== */

function openUserInformation(location = {}) {
    if ($("userState")) {
        $("userState").value = location.state || "";
        if (location.state && typeof populateDistrictSelect === "function") {
            populateDistrictSelect($("userDistrict"), location.state, currentLanguage === "hi" ? "ज़िला चुनें" : "Select District", location.district || "").catch(() => {});
        }
    }
    if ($("userTehsil")) $("userTehsil").value = location.tehsil || "";
    if ($("userVillage")) $("userVillage").value = location.village || "";
    if ($("dbResult")) $("dbResult").innerHTML = "";
    openModal("userInfoModal");
}

/* =====================================================
   PIPELINE
===================================================== */

function setPipelineStep(step, state = "active") {
    const el = $(`step${step}`);
    if (!el) return;

    el.classList.remove("active", "done");

    const icon = el.querySelector("i");

    if (state === "done") {
        el.classList.add("done");
        if (icon) icon.textContent = "✓";
    } else if (state === "active") {
        el.classList.add("active");
        if (icon) icon.textContent = "●";
    } else {
        if (icon) icon.textContent = "○";
    }
}

function resetPipeline() {
    for (let i = 1; i <= 5; i++) setPipelineStep(i, "waiting");
    if ($("processStatus")) $("processStatus").textContent = t("waiting");
}

function updatePipelineProgress() {
    for (let i = 1; i <= 5; i++) setPipelineStep(i, "waiting");

    setPipelineStep(1, "active");
    if ($("processStatus")) $("processStatus").textContent = t("preprocessing");
}

async function advancePipeline() {
    setPipelineStep(1, "done");
    setPipelineStep(2, "active");
    if ($("processStatus")) $("processStatus").textContent = t("ocrStatus");
    await delay(250);

    setPipelineStep(2, "done");
    setPipelineStep(3, "active");
    if ($("processStatus")) $("processStatus").textContent = t("classificationStatus");
    await delay(250);

    setPipelineStep(3, "done");
    setPipelineStep(4, "active");
    if ($("processStatus")) $("processStatus").textContent = t("validationStatus");
    await delay(250);

    setPipelineStep(4, "done");
    setPipelineStep(5, "active");
    if ($("processStatus")) $("processStatus").textContent = t("humanVerification");
    await delay(250);
}

function finishPipeline(success = true) {
    if (success) {
        setPipelineStep(5, "done");
        if ($("processStatus")) $("processStatus").textContent = t("completed");
    } else {
        setPipelineStep(5, "waiting");
        if ($("processStatus")) $("processStatus").textContent = t("failed");
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* =====================================================
   AI OUTPUT
===================================================== */

function setInputValue(id, value) {
    const input = $(id);
    if (input && value !== undefined && value !== null && String(value).trim() !== "") {
        input.value = value;
    }
}

function isInvalidApplicantName(value) {
    const v = String(value || "").trim().toLowerCase();
    return /\d|अनुमंडल|अंचल|हल्का|subdivision|circle|halka|anchal/.test(v) || v.length > 120;
}

function fillAIOutput(fields) {
    currentExtractedFields = { ...fields };
    const set = (id, key, fallbackKey = null) => setInputValue(id, fields[key] || (fallbackKey ? fields[fallbackKey] : ""));
    set("aiLandownerName", "user_name");
    set("aiSurveyNumber", "survey_number", "khasra_number");
    set("aiKhesaraNumber", "khasra_number");
    set("aiKhataNumber", "khata_number");
    set("aiKhatiyanNumber", "khatiyan_number");
    set("aiPlotArea", "area");
    set("aiVillage", "village");
    set("aiTehsil", "tehsil");
    set("aiState", "state");
    set("aiDistrict", "district");
    set("aiLandClassification", "land_classification", "land_type");
    set("aiOwnershipType", "ownership_type");
    set("aiMutationStatus", "mutation_status");
    set("aiRegistrationId", "registration_id");
    set("aiCircle", "circle");
    set("aiRevenueThana", "revenue_thana");
    set("aiAddress", "address");
    set("aiPinCode", "pin_code");
    set("aiVillageCode", "village_code");
    set("aiWard", "ward");
    set("aiPlotNumber", "plot_number");
    set("aiUlpin", "ulpin");
    set("aiRegistryDeedNumber", "registry_deed_number");
    set("aiRegistryDate", "registry_date");
    set("aiRegistrationOffice", "registration_office");
    set("aiBoundaryEast", "boundary_east");
    set("aiBoundaryWest", "boundary_west");
    set("aiBoundaryNorth", "boundary_north");
    set("aiBoundarySouth", "boundary_south");

    const map = {
        user_name: "userName", state: "userState", district: "userDistrict", subdivision: "userSubdivision", tehsil: "userTehsil",
        circle: "userCircle", revenue_thana: "userRevenueThana", village: "userVillage", village_code: "userVillageCode", address: "userAddress",
        khasra_number: "userKhesara", survey_number: "userSurveyNumber", plot_number: "userPlotNumber", khata_number: "userKhata", khatiyan_number: "userKhatiyan", area: "userArea", land_type: "userLandType", land_classification: "userLandClassification", ownership_type: "userOwnership",
        mutation_status: "userMutationStatus", ward: "userWard", pin_code: "userPinCode", registration_id: "userRegistration", registry_deed_number: "userRegistryDeedNumber", registry_date: "userRegistryDate", registration_office: "userRegistrationOffice", ulpin: "userUlpin", father_name: "fatherName", mother_name: "motherName", boundary_east: "userBoundaryEast", boundary_west: "userBoundaryWest", boundary_north: "userBoundaryNorth", boundary_south: "userBoundarySouth"
    };
    Object.entries(map).forEach(([key, id]) => {
        const value = key === "user_name" && isInvalidApplicantName(fields[key]) ? "" : fields[key];
        if (!value) return;
        const input = $(id);
        if (!input) return;
        input.value = value;
    });

    if ($("userState") && fields.state && typeof populateDistrictSelect === "function") {
        populateDistrictSelect($("userDistrict"), fields.state, currentLanguage === "hi" ? "ज़िला चुनें" : "Select District", fields.district || "").catch(() => {});
    }
    const confidence = fields.confidence || "Unknown";
    const count = Object.keys(fields).filter(k => k !== "confidence").length;
    const badge = $("aiConfidenceBadge");
    if (badge) badge.textContent = `AI: ${confidence} • ${count} fields`;
}

function clearAIOutput() {
    document.querySelectorAll(".data-card .fields input").forEach(input => input.value = "");
    currentExtractedFields = {};
}

/* =====================================================
   AI EXTRACTION
===================================================== */

async function extractPdfTextInBrowser(file) {
    if (!window.pdfjsLib) throw new Error("Browser PDF engine is not available.");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
    const pageLimit = Math.min(pdf.numPages, 30);
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str || "").join(" ").replace(/\s+/g, " ").trim();
        if (pageText) pages.push(pageText);
    }
    return pages.join("\n").trim();
}

async function ocrScannedPdfInBrowser(file) {
    if (!window.pdfjsLib || !window.Tesseract) throw new Error("Browser OCR engine is not available.");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
    const pageLimit = Math.min(pdf.numPages, 5);
    const selectedLanguage = String($("documentLanguage")?.value || "English").toLowerCase();
    const language = selectedLanguage.includes("hindi") ? "hin" : "eng";
    const worker = await Tesseract.createWorker(language);
    const texts = [];
    try {
        for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 1.6 });
            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
            const result = await worker.recognize(canvas);
            const text = result?.data?.text || "";
            if (text.trim()) texts.push(text.trim());
        }
    } finally {
        await worker.terminate();
    }
    return texts.join("\n").trim();
}

async function extractFieldsFromText(text) {
    const response = await fetch("/api/ai/extract-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    const { data, rawText } = await parseApiResponse(response);
    if (!response.ok || !data?.success) throw new Error(localizeServerMessage(data?.message || rawText, data || {}));
    return data;
}

function getStaffToken() {
    return localStorage.getItem("bhurakshak-staff-token") || "";
}

function staffHeaders(json = false) {
    const headers = {};
    if (json) headers["Content-Type"] = "application/json";
    const token = getStaffToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
}

function handleStaffRequired() {
    window.currentLoginType = "officer";
    if ($("loginType")) $("loginType").textContent = currentLanguage === "hi" ? "अधिकारी एक्सेस" : "OFFICER ACCESS";
    if ($("loginTitle")) $("loginTitle").textContent = currentLanguage === "hi" ? "अधिकारी लॉगिन" : "Officer Login";
    if ($("loginDescription")) $("loginDescription").textContent = currentLanguage === "hi" ? "भूमि रिकॉर्ड की समीक्षा और सत्यापन के लिए लॉगिन करें।" : "Sign in to review and verify user land records.";
    if ($("loginIdentifierLabel")) $("loginIdentifierLabel").textContent = currentLanguage === "hi" ? "Officer ID" : "Officer ID";
    if ($("loginUser")) { $("loginUser").value = ""; $("loginUser").placeholder = "Enter Officer ID"; }
    if ($("loginPassword")) $("loginPassword").value = "";
    loadLoginCaptcha();
    showToast(currentLanguage === "hi" ? "पहले Officer Login करें।" : "Please sign in as an officer first.", "error");
    openModal("loginModal");
}

function copySelectedDocumentToLandRecord() {
    const source = $("fileInput");
    const target = document.querySelector('input[name="land_document"]');
    if (!source?.files?.length || !target || target.files?.length) return;
    try {
        const dt = new DataTransfer();
        dt.items.add(source.files[0]);
        target.files = dt.files;
        const name = document.querySelector('[data-file-name="land_document"]');
        if (name) name.textContent = source.files[0].name;
    } catch (error) {
        console.warn("Could not copy selected document into land record form:", error);
    }
}

async function uploadDocumentForManualReview(file) {
    const formData = new FormData();
    formData.append("document", file);
    const response = await fetch("/api/documents/upload", { method: "POST", body: formData });
    const parsed = await parseApiResponse(response);
    if (!response.ok || !parsed.data?.success) {
        const serverMessage = parsed.data?.message || parsed.rawText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        throw new Error(localizeServerMessage(serverMessage, parsed.data || {}));
    }
    return parsed.data;
}

async function startAIExtraction() {
    const fileInput = $("fileInput");
    const button = $("processButton");

    if (!fileInput?.files?.length) {
        showToast(msg("uploadDocument"), "error");
        return;
    }

    const file = fileInput.files[0];
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        showToast(msg("invalidFileType"), "error");
        return;
    }

    if (file.size > 20 * 1024 * 1024) {
        showToast(msg("fileTooLarge"), "error");
        return;
    }

    if (button) {
        button.disabled = true;
        button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${t("extracting")}`;
    }

    resetPipeline();
    clearAIOutput();
    updatePipelineProgress();

    try {
        // First persist the selected file. This makes upload independent from
        // OCR/PDF parsing, so an extraction failure can never make the upload disappear.
        const storedUpload = await uploadDocumentForManualReview(file);
        showToast(
            currentLanguage === "hi"
                ? "दस्तावेज़ सर्वर पर सुरक्षित रूप से अपलोड हो गया है। अब AI प्रोसेसिंग शुरू हो रही है।"
                : "Document uploaded securely. AI processing is starting.",
            "success"
        );

        let data;
        data = {
            success: true,
            fields: {},
            confidence: "Manual",
            text: "",
            upload_url: storedUpload.upload_url,
            file_name: file.name
        };

        if (extension === "pdf" && window.pdfjsLib) {
            try {
                let browserText = await extractPdfTextInBrowser(file);
                if (!browserText) {
                    try {
                        showToast(currentLanguage === "hi" ? "स्कैन PDF मिली है। OCR शुरू हो रहा है..." : "Scanned PDF detected. Starting browser OCR...", "info");
                        browserText = await ocrScannedPdfInBrowser(file);
                    } catch (ocrError) {
                        console.warn("Browser OCR failed; trying server extraction:", ocrError);
                    }
                }
                if (!browserText) throw new Error(currentLanguage === "hi" ? "इस PDF से टेक्स्ट नहीं पढ़ा जा सका।" : "No readable text could be extracted from this PDF.");
                const extracted = await extractFieldsFromText(browserText);
                data = { ...data, ...extracted, upload_url: data.upload_url };
            } catch (browserError) {
                console.warn("Browser PDF extraction failed; trying server extraction:", browserError);
                const formData = new FormData();
                formData.append("document", file);
                formData.append("ocr_language", String($("documentLanguage")?.value || "English").toLowerCase().includes("hindi") ? "hin" : "eng");
                const response = await fetch("/api/ai/extract", { method: "POST", body: formData });
                const parsed = await parseApiResponse(response);
                if (!response.ok || !parsed.data?.success) {
                    try {
                        const fallbackUpload = await uploadDocumentForManualReview(file);
                        data = { ...data, ...fallbackUpload, upload_url: data.upload_url || fallbackUpload.upload_url };
                        data.warning = data.warning || (currentLanguage === "hi"
                            ? "दस्तावेज़ सफलतापूर्वक अपलोड हो गया है। स्वचालित OCR उपलब्ध नहीं था; अधिकारी इसकी मैनुअल समीक्षा कर सकते हैं।"
                            : "The document was uploaded successfully. Automatic OCR was unavailable; an officer can review it manually.");
                    } catch (fallbackError) {
                        const serverMessage = parsed.data?.message || parsed.rawText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
                        throw new Error(localizeServerMessage(serverMessage || fallbackError.message, parsed.data || {}));
                    }
                } else {
                    data = { ...data, ...parsed.data, upload_url: data.upload_url || parsed.data.upload_url };
                }
            }
        } else {
            const formData = new FormData();
            formData.append("document", file);
            const response = await fetch("/api/ai/extract", { method: "POST", body: formData });
            const parsed = await parseApiResponse(response);
            if (!response.ok || !parsed.data?.success) {
                try {
                    const fallbackUpload = await uploadDocumentForManualReview(file);
                    data = { ...data, ...fallbackUpload, upload_url: data.upload_url || fallbackUpload.upload_url };
                    data.warning = data.warning || (currentLanguage === "hi"
                        ? "दस्तावेज़ सफलतापूर्वक अपलोड हो गया है। अधिकारी इसकी मैनुअल समीक्षा कर सकते हैं।"
                        : "The document was uploaded successfully. An officer can review it manually.");
                } catch (fallbackError) {
                    const serverMessage = parsed.data?.message || parsed.rawText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
                    throw new Error(localizeServerMessage(serverMessage || fallbackError.message, parsed.data || {}));
                }
            } else {
                data = { ...data, ...parsed.data, upload_url: data.upload_url || parsed.data.upload_url };
            }
        }

        console.log("AI EXTRACTION RESPONSE:", data);

        await advancePipeline();

        const fields = data.fields || {};
        fields.confidence = data.confidence || "Unknown";
        fillAIOutput(fields);
        copySelectedDocumentToLandRecord();
        if (data.upload_url && $("fileName")) {
            $("fileName").innerHTML = `<span class="file-uploaded-badge">✓ ${escapeHTML(file.name)} — uploaded</span>`;
        }

        if (data.warning) {
            showToast(currentLanguage === "hi" ? "दस्तावेज़ अपलोड हो गया है। अधिकारी मैनुअल समीक्षा कर सकते हैं।" : "Document uploaded successfully. Manual officer review is available.", "info");
        }

        const count = Object.entries(fields)
            .filter(([key, value]) => key !== "confidence" && Boolean(String(value || "").trim()))
            .length;

        finishPipeline(count > 0);

        if (count === 0) {
            showToast(msg("extractionNoFields"), "error");
        } else {
            showToast(msg("extractionSuccess", count), "success");
        }

        if ($("extractedText")) $("extractedText").textContent = data.text || "";

        // Automatically show user form after successful extraction.
        openModal("userInfoModal");

    } catch (error) {
        console.error("AI EXTRACTION ERROR:", error);
        finishPipeline(false);
        showToast(error.message || msg("extractingFailed"), "error");
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${t("startExtraction")}`;
        }
    }
}

/* =====================================================
   SAVE USER RECORD
===================================================== */

function showValidationPopup(missing = [], messageKey = "validationPopupMessage") {
    const modal = $("formValidationModal");
    const title = $("validationPopupTitle");
    const message = $("validationPopupMessage");
    const list = $("validationPopupList");
    const icon = modal?.querySelector(".validation-popup-icon");

    if (title) title.textContent = t("validationPopupTitle");
    if (message) message.textContent = t(messageKey);
    if (list) {
        list.innerHTML = missing.length
            ? `<ul>${missing.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`
            : "";
    }
    if (icon) icon.textContent = "!";

    openModal("formValidationModal");
    modal?.setAttribute("aria-hidden", "false");
}


function getFieldLabel(field) {
    return field?.closest("label")?.querySelector("span")?.textContent?.trim()
        || field?.name
        || "Required field";
}

function validateSubmitForm(form) {
    const requiredFields = Array.from(form.querySelectorAll("[required]"));
    const missing = [];
    let firstInvalid = null;

    for (const field of requiredFields) {
        const isFile = field.type === "file";
        const empty = isFile ? !field.files?.length : !field.value.trim();
        const invalid = empty || !field.checkValidity();

        if (invalid) {
            if (!firstInvalid) firstInvalid = field;
            if (!missing.includes(getFieldLabel(field))) missing.push(getFieldLabel(field));
        }
    }

    // Also block submission when an optional field violates its format/pattern.
    if (!missing.length && !form.checkValidity()) {
        const invalidFields = Array.from(form.querySelectorAll(":invalid"));
        for (const field of invalidFields) {
            const label = getFieldLabel(field);
            if (!missing.includes(label)) missing.push(label);
            if (!firstInvalid) firstInvalid = field;
        }
    }

    if (firstInvalid) firstInvalid.focus({ preventScroll: true });
    return missing;
}

async function submitUserRecord(event, submitAction = "submit") {
    event?.preventDefault?.();

    const form = $("userInfoForm");
    if (!form) return;

    // Draft can be incomplete; Save & Submit cannot.
    if (submitAction === "submit") {
        const missing = validateSubmitForm(form);
        if (missing.length) {
            showValidationPopup(missing);
            return;
        }
    }

    const actionButtons = form.querySelectorAll("[data-form-action]");
    actionButtons.forEach(button => { button.disabled = true; });

    const activeButton = form.querySelector(`[data-form-action="${submitAction}"]`);
    if (activeButton) {
        activeButton.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i> ${currentLanguage === "hi" ? (submitAction === "submit" ? "सबमिट हो रहा है..." : "सेव हो रहा है...") : (submitAction === "submit" ? "Submitting..." : "Saving...")}`;
    }

    try {
        const formData = new FormData(form);
        formData.set("submit_action", submitAction);

        if (currentExtractedFields.confidence) formData.set("confidence", currentExtractedFields.confidence);
        if (currentExtractedFields.source_language) formData.set("source_language", currentExtractedFields.source_language);
        if (currentExtractedFields.extraction_engine) formData.set("extraction_engine", currentExtractedFields.extraction_engine);

        const response = await fetch("/api/records", {
            method: "POST",
            body: formData
        });

        let data = {};
        try {
            data = await response.json();
        } catch {
            throw new Error(msg("invalidJson"));
        }

        if (!response.ok || !data.success) {
            throw new Error(localizeServerMessage(data.message, data));
        }

        currentRecordId = data.record?.id || null;

        // Submit success: show result briefly in the background, then close the form.
        showDatabaseResult(data.record, data.documents || []);
        showToast(
            submitAction === "submit"
                ? t("submitSuccess")
                : (currentLanguage === "hi" ? msg("draftSaved") : msg("draftSaved")),
            "success"
        );

        if (getStaffToken()) { await loadRecords(); await loadStats(); }

        if (submitAction === "submit") {
            closeModal("userInfoModal");
            form.reset();
            if ($("dbResult")) $("dbResult").innerHTML = "";
            currentRecordId = null;
        }

    } catch (error) {
        console.error("SUBMIT ERROR:", error);
        showDatabaseError(error.message);
        showToast(error.message || msg("saveFailedGeneric"), "error");
    } finally {
        actionButtons.forEach(button => { button.disabled = false; });

        const saveButton = form.querySelector('[data-form-action="save"]');
        const submitButton = form.querySelector('[data-form-action="submit"]');

        if (saveButton) saveButton.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> ${t("saveDraft")}`;
        if (submitButton) submitButton.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t("submitVerification")}`;
    }
}

function showDatabaseResult(record, documents = []) {
    const box = $("dbResult");
    if (!box) return;

    box.innerHTML = `
        <div class="db-result-card">
            <h3>✅ Database Condition: TRUE</h3>
            <p>${msg("databaseSaved")}</p>
            <div class="db-grid">
                <div><span>Record ID</span><b>${escapeHTML(record?.record_id)}</b></div>
                <div><span>User</span><b>${escapeHTML(record?.user_name)}</b></div>
                <div><span>State</span><b>${escapeHTML(record?.state)}</b></div>
                <div><span>District</span><b>${escapeHTML(record?.district)}</b></div>
                <div><span>Village</span><b>${escapeHTML(record?.village)}</b></div>
                <div><span>Khasra</span><b>${escapeHTML(record?.khasra_number)}</b></div>
            </div>
            <p>${documents.length} document(s) uploaded.</p>
        </div>
    `;
}

function showDatabaseError(message) {
    const box = $("dbResult");
    if (!box) return;

    box.innerHTML = `
        <div class="db-result-card error">
            <h3>✕ ${currentLanguage === "hi" ? "डेटाबेस सेव विफल" : "Database Save Failed"}</h3>
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}

/* =====================================================
   SAVE USER FORM
===================================================== */

async function saveUserDraft() {
    const form = $("userInfoForm");
    if (!form) return;

    await submitUserRecord({ preventDefault() {} }, "save");
}

/* =====================================================
   SUBMIT AI OUTPUT
===================================================== */

async function submitExtractedRecord() {
    const form = $("userInfoForm");
    if (!form) return;
    openModal("userInfoModal");
    await submitUserRecord({ preventDefault() {} }, "submit");
}

/* =====================================================
   SAVE DRAFT
===================================================== */

function saveDraft() {
    const values = {};
    document.querySelectorAll(".data-card .fields input").forEach((input, index) => {
        values[index] = input.value;
    });

    localStorage.setItem("bhurakshak_ai_draft", JSON.stringify(values));
    showToast(msg("localDraftSaved"), "success");
}

/* =====================================================
   VALIDATION / AUDIT / ANALYTICS
===================================================== */
async function loadValidationAnalysis(){
  const box=$("validationResults"); try{const r=await fetch("/api/validation",{headers:staffHeaders()});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.message||"Validation unavailable.");
    $("validationPassed").textContent=d.summary.passed;$("validationReview").textContent=d.summary.review;$("validationDuplicates").textContent=d.summary.duplicates;
    const rows=d.results.slice(0,20);box.innerHTML=`<h3>Live Validation Results</h3>`+(rows.length?rows.map(x=>`<div class="rule ${x.result!=="Passed"?"warning":""}"><span>${x.result==="Passed"?"✓":"!"}</span><div><b>${escapeHTML(x.record_id)} — ${escapeHTML(x.user_name)}</b><small>${x.issues.length?escapeHTML(x.issues.join(" • ")):"All configured checks passed"}</small></div><strong>${x.result.toUpperCase()}</strong></div>`).join(""):"<div class='portal-empty'>No records available for validation.</div>");
  }catch(e){box.innerHTML=`<h3>Validation Results</h3><div class="rule warning"><span>!</span><div><b>Unable to load validation</b><small>${escapeHTML(e.message)}</small></div><strong>ERROR</strong></div>`}
}
async function loadAuditTrail(){
  const box=$("auditLogList"); if(!box)return; try{const r=await fetch("/api/audit",{headers:staffHeaders()});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.message||"Audit unavailable.");
    box.innerHTML=d.logs.length?d.logs.map(log=>`<div class="audit-row"><span>•</span><div><b>${escapeHTML(log.action.replaceAll("_"," "))}</b><small>${escapeHTML(log.record_id||"System")} • ${escapeHTML(log.actor_role)} / ${escapeHTML(log.actor_id)}${log.details?" • "+escapeHTML(log.details):""}</small></div><strong>${escapeHTML(log.created_at||"")}</strong></div>`).join(""):"<div class='portal-empty'>No audit events recorded yet.</div>";
  }catch(e){box.innerHTML=`<div class="audit-row"><span>!</span><div><b>Audit trail unavailable</b><small>${escapeHTML(e.message)}</small></div><strong>ERROR</strong></div>`}
}
async function loadAnalytics(){
  const box=$("analyticsLive");if(!box)return;try{const r=await fetch("/api/analytics",{headers:staffHeaders()});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.message||"Analytics unavailable.");
    const status=Object.fromEntries(d.status.map(x=>[x.status,Number(x.count)]));const conf=Object.fromEntries(d.confidence.map(x=>[x.confidence||"Manual",Number(x.count)]));const max=Math.max(1,...d.daily.map(x=>Number(x.count)));
    box.innerHTML=`<div class="analytics-kpis"><div class="chart-card"><small>Total records</small><strong>${Object.values(status).reduce((a,b)=>a+b,0)}</strong></div><div class="chart-card"><small>Verified rate</small><strong>${d.verification_rate}%</strong></div><div class="chart-card"><small>Documents</small><strong>${d.documents}</strong></div><div class="chart-card"><small>High confidence</small><strong>${conf.High||0}</strong></div></div><div class="chart-card"><div class="chart-title"><h3>Records Processed — Last 14 Days</h3></div><div class="bars live-bars">${d.daily.map(x=>`<i style="height:${Math.max(8,(Number(x.count)/max)*100)}%"><span>${escapeHTML(x.day.slice(5))}</span></i>`).join("")}</div><div class="analytics-status"><span>Pending: ${status.Pending||0}</span><span>Verified: ${status.Verified||0}</span><span>Rejected: ${status.Rejected||0}</span><span>Draft: ${status.Draft||0}</span></div></div>`;
  }catch(e){box.innerHTML=`<div class="chart-card"><h3>Analytics unavailable</h3><p>${escapeHTML(e.message)}</p></div>`}
}

/* =====================================================
   RECORDS
===================================================== */

async function loadRecords() {
    const table = $("recordsTable");
    if (!table) return;

    try {
        const query = ($("recordSearch")?.value || "").trim();
        const response = await fetch(`/api/public/records${query ? `?q=${encodeURIComponent(query)}` : ""}`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Unable to load records.");

        const records = Array.isArray(data.records) ? data.records : [];
        const status = $("statusFilter")?.value || "All Status";
        const filtered = records.filter(record => status === "All Status" || record.status === status);

        table.innerHTML = "";
        if (!filtered.length) {
            table.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:25px">No land records found.</td></tr>`;
            return;
        }

        filtered.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><b>${escapeHTML(record.record_id)}</b></td>
                <td>${escapeHTML(record.user_name || "—")}</td>
                <td>${escapeHTML(record.khasra_number || record.plot_number || "—")}</td>
                <td>${escapeHTML(record.area || "—")}</td>
                <td>${escapeHTML([record.village, record.district, record.state].filter(Boolean).join(", "))}</td>
                <td><span class="table-status verified">Verified</span></td>
                <td>—</td>
                <td><button class="row-action" type="button" data-public-record-id="${escapeHTML(record.id)}" data-public-record-code="${escapeHTML(record.record_id)}">View Document</button></td>
            `;
            table.appendChild(row);
        });

        table.querySelectorAll("[data-public-record-id]").forEach(button => {
            button.addEventListener("click", () => {
                // Opening a digital document from the Land Records section
                // requires Officer authentication first. Do not expose the
                // document before the officer credentials are verified.
                window.pendingOfficerDocumentId = button.dataset.publicRecordId;
                window.currentLoginType = "officer";
                document.querySelector('[data-login="officer"]')?.click();
            });
        });
    } catch (error) {
        console.error("LOAD PUBLIC RECORDS ERROR:", error);
        table.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:25px">Unable to load land records.</td></tr>`;
    }
}

async function openPublicLandRecord(id, expectedRecordId="") {
    const recordId = String(expectedRecordId || "").trim();
    if (!recordId) { showToast("Record ID is missing.", "error"); return; }
    try {
        const response = await fetch(`/api/public/records/${encodeURIComponent(id)}/view`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "The land record could not be opened.");

        const r = data.record || {};
        const details = [
            ["Record ID", r.record_id], ["Name", r.user_name], ["Father Name", r.father_name],
            ["Mother Name", r.mother_name], ["State", r.state], ["District", r.district],
            ["Village", r.village], ["Khesara", r.khasra_number], ["Survey No.", r.survey_number],
            ["Plot No.", r.plot_number], ["Khata No.", r.khata_number], ["Khatiyan No.", r.khatiyan_number],
            ["Area", r.area], ["Land Type", r.land_type], ["Ownership", r.ownership_type],
            ["Mutation Status", r.mutation_status], ["East", r.boundary_east], ["West", r.boundary_west],
            ["North", r.boundary_north], ["South", r.boundary_south], ["Status", r.status]
        ];
        const box = $("gisResult");
        if (box) {
            box.hidden = false;
            box.innerHTML = `<div class="gis-result-grid">${details.map(([k,v]) => `<div><span>${escapeHTML(k)}</span><b>${escapeHTML(v || "—")}</b></div>`).join("")}</div><div class="gis-result-note"><b>Record ID: ${escapeHTML(r.record_id || "—")}</b><br><span class="field-help">Verified record details are available. Officer authentication is required to open the generated digital document from this section.</span><br><button type="button" class="primary-btn" data-officer-document-id="${escapeHTML(r.id)}">View Digital Document — Officer Login</button></div>`;
            box.querySelector("[data-officer-document-id]")?.addEventListener("click", () => { window.pendingOfficerDocumentId = r.id; window.currentLoginType = "officer"; document.querySelector('[data-login="officer"]')?.click(); });
            box.scrollIntoView({behavior:"smooth",block:"nearest"});
        }
        showToast(currentLanguage === "hi" ? "रिकॉर्ड सफलतापूर्वक खोला गया।" : "Land record opened successfully.", "success");
    } catch (error) {
        showToast(error.message, "error");
    }
}

/* =====================================================
   HUMAN VERIFICATION
===================================================== */

async function openHumanVerification(id) {
    try {
        if (!getStaffToken()) { handleStaffRequired(); return; }
        const response = await fetch(`/api/admin/records/${encodeURIComponent(id)}`, { headers: staffHeaders() });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Record not found.");

        const record = data.record;
        const documents = data.documents || [];

        if ($("humanVerifyTitle")) {
            $("humanVerifyTitle").textContent =
                `${record.user_name || ""} — ${record.record_id || ""}`;
        }

        if ($("humanVerifyBody")) {
            $("humanVerifyBody").innerHTML = `
                <div class="db-result-card">
                    <h3>Complete User Information</h3>
                    <div class="db-grid">
                        ${[
                            ["Name", record.user_name],
                            ["Mobile", record.user_contact],
                            ["Email", record.user_email],
                            ["State", record.state],
                            ["District", record.district],
                            ["Tehsil", record.tehsil],
                            ["Village", record.village],
                            ["Khasra", record.khasra_number],
                            ["Khata / Khatauni", record.khata_number],
                            ["Area", record.area],
                            ["Land Type", record.land_type],
                            ["Ownership", record.ownership_type],
                            ["Registration ID", record.registration_id],
                            ["Parent 1", record.father_name],
                            ["Parent 2", record.mother_name],
                            ["Status", record.status],
                            ...(record.rejection_reason
                                ? [["Rejection Reason", record.rejection_reason]]
                                : [])
                        ].map(([label, value]) => `
                            <div><span>${escapeHTML(label)}</span><b>${escapeHTML(value)}</b></div>
                        `).join("")}
                    </div>
                </div>

                <div class="db-result-card" style="margin-top:12px">
                    <h3>Uploaded Documents</h3>
                    <div class="doc-list">
                        ${documents.length
                            ? documents.map(document => `
                                <div class="doc-item">
                                    <div>
                                        <b>${escapeHTML(document.document_type)}</b>
                                        <small>${escapeHTML(document.original_name)}</small>
                                    </div>
                                    <button type="button" class="doc-open-btn" data-doc-id="${escapeHTML(document.id)}">Open</button>
                                </div>
                            `).join("")
                            : "<p>No documents uploaded.</p>"
                        }
                    </div>
                </div>
                <div id="rejectionPanel" style="display:none;margin-top:12px" class="db-result-card">
                    <h3>Rejection Reason</h3>
                    <textarea
                        id="rejectionReason"
                        rows="3"
                        placeholder="Enter the reason for rejecting this record..."
                        style="width:100%;margin-top:8px;padding:10px;border:1px solid #d1d5db;border-radius:10px;resize:vertical"
                    ></textarea>
                    <button
                        class="primary-btn"
                        type="button"
                        id="confirmRejectRecord"
                        style="margin-top:10px"
                    >Confirm Rejection</button>
                </div>
            `;
        }

        const staffRole = localStorage.getItem("bhurakshak-staff-role") || "";
        const isOfficer = staffRole === "officer";
        if ($("approveApplicantRecord")) {
            $("approveApplicantRecord").dataset.id = id;
            $("approveApplicantRecord").style.display = isOfficer && record.status !== "Verified" ? "inline-flex" : "none";
        }
        if ($("rejectApplicantRecord")) {
            $("rejectApplicantRecord").dataset.id = id;
            $("rejectApplicantRecord").style.display = isOfficer && record.status !== "Verified" ? "inline-flex" : "none";
        }
        if ($("rejectionPanel")) $("rejectionPanel").style.display = "none";

        openModal("humanVerificationModal");
        document.querySelectorAll("[data-doc-id]").forEach(btn => btn.addEventListener("click", () => openProtectedDocument(btn.dataset.docId)));
    } catch (error) {
        console.error("VERIFICATION ERROR:", error);
        showToast(error.message || "Unable to open record.", "error");
    }
}

async function openProtectedDocument(id) {
    try {
        const response = await fetch(`/api/admin/documents/${encodeURIComponent(id)}`, { headers: staffHeaders() });
        if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.message || "Document could not be opened."); }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) { showToast(error.message, "error"); }
}

async function approveRecord() {
    const button = $("approveApplicantRecord");
    const id = button?.dataset.id;

    if (!id) {
        showToast("Record ID missing.", "error");
        return;
    }

    try {
        const response = await fetch(`/api/admin/records/${encodeURIComponent(id)}/status`, {
            method: "PUT",
            headers: staffHeaders(true),
            body: JSON.stringify({ status: "Verified" })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to approve.");
        }

        showToast("Record verified successfully.", "success");
        closeModal("humanVerificationModal");
        if (getStaffToken()) { await loadRecords(); await loadStats(); }

    } catch (error) {
        console.error("APPROVE ERROR:", error);
        showToast(error.message || "Verification failed.", "error");
    }
}

async function rejectRecord() {
    const button = $("rejectApplicantRecord");
    const id = button?.dataset.id;
    const panel = $("rejectionPanel");

    if (!id) {
        showToast("Record ID missing.", "error");
        return;
    }

    if (panel) panel.style.display = "block";
    $("rejectionReason")?.focus();
}

async function confirmRejectRecord() {
    const button = $("confirmRejectRecord");
    const id = $("rejectApplicantRecord")?.dataset.id;
    const reason = ($("rejectionReason")?.value || "").trim();

    if (!id) {
        showToast("Record ID missing.", "error");
        return;
    }
    if (!reason) {
        showToast(msg("rejectReason"), "error");
        $("rejectionReason")?.focus();
        return;
    }

    try {
        button.disabled = true;
        const response = await fetch(`/api/admin/records/${encodeURIComponent(id)}/status`, {
            method: "PUT",
            headers: staffHeaders(true),
            body: JSON.stringify({
                status: "Rejected",
                rejection_reason: reason
            })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to reject record.");
        }

        showToast("Record rejected with reason.", "success");
        closeModal("humanVerificationModal");
        if (getStaffToken()) { await loadRecords(); await loadStats(); }
    } catch (error) {
        console.error("REJECT ERROR:", error);
        showToast(error.message || (currentLanguage === "hi" ? "रिकॉर्ड अस्वीकार नहीं हो सका।" : "The record could not be rejected."), "error");
    } finally {
        if (button) button.disabled = false;
    }
}

/* =====================================================
   STATS
===================================================== */

async function loadStats() {
    try {
        const staffToken = getStaffToken();
        const response = await fetch(staffToken ? "/api/stats" : "/api/public/stats", {
            headers: staffToken ? staffHeaders() : {},
            cache: "no-store"
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Unable to load statistics.");

        if ($("queueCount")) $("queueCount").textContent = data.pending ?? 0;
        if ($("queueLarge")) $("queueLarge").textContent = data.pending ?? 0;
        if ($("verificationQueueCount")) $("verificationQueueCount").textContent = data.pending ?? 0;
        if ($("statTotal")) $("statTotal").textContent = data.total ?? 0;
        if ($("statPending")) $("statPending").textContent = data.pending ?? 0;
        if ($("statVerified")) $("statVerified").textContent = data.verified ?? 0;
        if ($("statDocuments")) $("statDocuments").textContent = data.documents ?? 0;
        if ($("heroTotal")) $("heroTotal").textContent = data.total ?? 0;
        if ($("heroPending")) $("heroPending").textContent = data.pending ?? 0;
        if ($("heroVerified")) $("heroVerified").textContent = data.verified ?? 0;
        if ($("homeDuplicateAlerts")) $("homeDuplicateAlerts").textContent = data.duplicates ?? 0;
    } catch (error) {
        console.error("STATS ERROR:", error);
        // Keep the Home page useful even if the aggregate stats endpoint is temporarily unavailable.
        try {
            const fallback = await fetch("/api/public/records", { cache: "no-store" });
            const data = await fallback.json();
            const verified = Array.isArray(data.records) ? data.records : [];
            if ($("statTotal")) $("statTotal").textContent = verified.length;
            if ($("statVerified")) $("statVerified").textContent = verified.length;
            if ($("heroTotal")) $("heroTotal").textContent = verified.length;
            if ($("heroVerified")) $("heroVerified").textContent = verified.length;
            if ($("homeDuplicateAlerts")) $("homeDuplicateAlerts").textContent = 0;
        } catch (fallbackError) { console.error("STATS FALLBACK ERROR:", fallbackError); }
    }
}

/* =====================================================
   LOGIN / SIGNUP / SUPPORT
===================================================== */

async function loadLoginCaptcha() {
    const group = $("captchaGroup");
    if (!group) return;
    try {
        const response = await fetch("/api/auth/captcha", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "CAPTCHA could not be loaded.");
        $("captchaId").value = data.captcha.id;
        $("captchaQuestion").textContent = data.captcha.question;
        $("captchaAnswer").value = "";
        $("captchaStatus").textContent = "Solve the CAPTCHA before signing in.";
    } catch (error) {
        console.error("CAPTCHA LOAD ERROR:", error);
        $("captchaQuestion").textContent = "Unavailable";
        $("captchaStatus").textContent = "Refresh CAPTCHA to try again.";
    }
}

function closeMenu() {
    $("mobileNav")?.classList.remove("open");
    $("menuOverlay")?.classList.remove("open");
    $("menuButton")?.setAttribute("aria-expanded", "false");
}

function setupNameFieldValidation() {
    const nameFields = [
        "userName", "fatherName", "motherName", "signupName",
        "aiLandownerName"
    ];

    nameFields.forEach(id => {
        const input = $(id);
        if (!input) return;

        input.setAttribute("inputmode", "text");
        input.addEventListener("input", () => {
            // Remove numeric characters immediately while typing/pasting.
            input.value = input.value.replace(/[0-9]/g, "");
        });

        input.addEventListener("paste", event => {
            const text = event.clipboardData?.getData("text") || "";
            if (/\d/.test(text)) {
                event.preventDefault();
                input.value += text.replace(/[0-9]/g, "");
            }
        });
    });
}


function initInputRestrictions() {
    const nameFields = document.querySelectorAll(".name-only");
    const numberFields = document.querySelectorAll(".number-only");
    const numberSlashFields = document.querySelectorAll(".number-slash-only");

    nameFields.forEach(input => {
        input.addEventListener("input", () => {
            // Remove numeric characters from typed and pasted names.
            input.value = input.value.replace(/\p{N}/gu, "");
        });
    });

    numberFields.forEach(input => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "");
        });
    });

    numberSlashFields.forEach(input => {
        input.addEventListener("input", () => {
            // Khesara/Khata values may use formats such as 4/432 or 12-34.
            input.value = input.value.replace(/[^0-9\/-]/g, "");
        });
    });
}

// Global handlers log unexpected faults without creating a misleading popup on every
// section navigation. User-facing operations have their own actionable error handling.
window.addEventListener("error", event => {
    console.error("BhuRakshak UI error:", event.error || event.message);
});

window.addEventListener("unhandledrejection", event => {
    console.error("BhuRakshak async error:", event.reason);
});



async function refreshDatabaseStatus(){ return; }
async function initLocationSelectors() {
    if (typeof fillStateSelect !== "function") return;
    const userState = $("userState"), userDistrict = $("userDistrict");
    const gisState = $("gisState"), gisDistrict = $("gisDistrict");
    const stateText = currentLanguage === "hi" ? "राज्य / केंद्रशासित प्रदेश चुनें" : "Select State / UT";
    const districtText = currentLanguage === "hi" ? "ज़िला चुनें" : "Select District";
    if (userState) fillStateSelect(userState, stateText);
    if (gisState) fillStateSelect(gisState, stateText);
    userState?.addEventListener("change", () => populateDistrictSelect(userDistrict, userState.value, districtText));
    gisState?.addEventListener("change", async () => { await populateDistrictSelect(gisDistrict, gisState.value, districtText); await focusGISLocation(); });
    gisDistrict?.addEventListener("change", focusGISLocation);
}

async function focusGISLocation() {
    const state = $("gisState")?.value || "";
    const district = $("gisDistrict")?.value || "";
    if (!state) return;
    const query = [district, state, "India"].filter(Boolean).join(", ");
    try {
        const geo = await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=" + encodeURIComponent(query), { headers:{Accept:"application/json"} });
        const results = await geo.json();
        initializeMap();
        if (results[0]) {
            const lat=Number(results[0].lat), lon=Number(results[0].lon);
            landMap.setView([lat,lon], district ? 10 : 6);
            if (mapMarker) mapMarker.remove();
            mapMarker=L.marker([lat,lon]).addTo(landMap).bindPopup(escapeHTML(results[0].display_name)).openPopup();
            if ($("selectedLocation")) $("selectedLocation").textContent = results[0].display_name;
        }
    } catch (e) { console.warn("GIS LOCATION FOCUS:",e.message); }
}

async function viewGISRecord(recordId) {
    const id = String(recordId || "").trim();
    if (!id) return;
    try {
        const response = await fetch(`/api/gis/records/${encodeURIComponent(id)}/view`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) throw new Error(data.message || "The land record could not be opened.");
        const record = data.record || {};
        const box = $("gisResult");
        if (box) {
            box.hidden = false;
            const rows = [
                ["Record ID", record.record_id], ["Landowner", record.user_name], ["Father", record.father_name], ["Mother", record.mother_name],
                ["State", record.state], ["District", record.district], ["Village", record.village], ["Khesara", record.khasra_number],
                ["Survey Number", record.survey_number], ["Khata", record.khata_number], ["Khatiyan", record.khatiyan_number], ["Area", record.area],
                ["Land Type", record.land_type], ["Ownership", record.ownership_type], ["Mutation", record.mutation_status], ["Address", record.address],
                ["Registration ID", record.registration_id], ["Registry Deed", record.registry_deed_number], ["Registration Date", record.registry_date]
            ];
            box.innerHTML = `<div class="gis-result-grid">${rows.map(([k,v]) => `<div><span>${escapeHTML(k)}</span><b>${escapeHTML(v || "—")}</b></div>`).join("")}</div><div class="gis-result-note"><b>✓ Verified Record</b><br>Full digitized record opened for Record ID ${escapeHTML(record.record_id || "—")}.<br><button type="button" class="secondary-btn gis-digital-document" data-gis-digital-id="${escapeHTML(record.id)}">Open Digital Document</button></div>`;
            box.querySelector("[data-gis-digital-id]")?.addEventListener("click",e=>openPublicDigitalDocument(e.currentTarget.dataset.gisDigitalId));
        }
        showToast(currentLanguage === "hi" ? "रिकॉर्ड सफलतापूर्वक खोला गया।" : "Land record opened successfully.", "success");
    } catch (error) {
        console.error("PUBLIC RECORD VIEW ERROR:", error);
        showToast(error.message || "The land record could not be opened.", "error");
    }
}

async function openPublicDigitalDocument(id) {
    const recordId = String(id || "").trim();
    if (!recordId) return;
    try {
        const response = await fetch(`/api/public/records/${encodeURIComponent(recordId)}/digital-document`, { headers: { "Accept": "text/html" } });
        if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.message || "Digital document could not be opened."); }
        const html = await response.text();
        const url = URL.createObjectURL(new Blob([html], {type:"text/html;charset=utf-8"}));
        window.open(url, "_blank", "noopener");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) { showToast(error.message || "Digital document could not be opened.", "error"); }
}

async function searchGISParcel() {
    const query = $("gisQuery")?.value.trim() || "";
    const state = $("gisState")?.value || "";
    const district = $("gisDistrict")?.value || "";
    const village = $("gisVillage")?.value.trim() || "";
    const khasra = $("gisKhesara")?.value.trim() || "";
    if (query) {
        try {
            const params = new URLSearchParams({ q: query });
            const response = await fetch(`/api/gis/search?${params}`);
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "GIS search failed.");
            const record = data.record;
            const box = $("gisResult");
            if (!record) {
                if (box) { box.hidden = false; box.innerHTML = `<div class="gis-result-note">No verified land record matched <b>${escapeHTML(query)}</b>.</div>`; }
                return;
            }
            let lat = record.latitude, lon = record.longitude;
            let display = `${record.village || "Parcel"}, ${record.district || ""}, ${record.state || ""}`;
            if (!lat || !lon) {
                const q = [record.village, record.district, record.state, "India"].filter(Boolean).join(", ");
                const geo = await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=" + encodeURIComponent(q), { headers:{Accept:"application/json"} });
                const results = await geo.json();
                if (results[0]) { lat = Number(results[0].lat); lon = Number(results[0].lon); display = results[0].display_name; }
            }
            initializeMap();
            if (lat && lon) { landMap.setView([Number(lat), Number(lon)], record.latitude ? 17 : 13); if (mapMarker) mapMarker.remove(); mapMarker=L.marker([Number(lat), Number(lon)]).addTo(landMap).bindPopup(escapeHTML(display)).openPopup(); }
            if ($("selectedLocation")) $("selectedLocation").textContent = display;
            if (box) {
                box.hidden = false;
                box.innerHTML = `<div class="gis-result-grid">${[["Record ID",record.record_id],["State",record.state],["District",record.district],["Village",record.village],["Khesara",record.khasra_number || record.survey_number || record.plot_number],["Area",record.area],["Land Type",record.land_type],["Status",record.status]].map(([k,v])=>`<div><span>${escapeHTML(k)}</span><b>${escapeHTML(v||"—")}</b></div>`).join("")}</div><div class="gis-result-note"><button type="button" class="primary-btn gis-view-record" data-gis-record-id="${escapeHTML(record.id)}">View Full Land Record</button><br><button type="button" class="secondary-btn gis-digital-document" data-gis-digital-id="${escapeHTML(record.id)}">Open Digital Document</button><br><a href="${escapeHTML(record.official_portal || data.official_portal || "https://dolr.gov.in/")}" target="_blank" rel="noopener noreferrer">Open official State/UT land-record portal ↗</a></div>`;
                box.querySelector("[data-gis-record-id]")?.addEventListener("click", e => viewGISRecord(e.currentTarget.dataset.gisRecordId));
            }
            return;
        } catch (error) { console.error("GIS GENERAL SEARCH ERROR:", error); showToast(error.message || "GIS search failed.", "error"); return; }
    }
    if (!state || !district) { showToast(currentLanguage === "hi" ? "पहले सामान्य खोज या राज्य और ज़िला चुनें।" : "Use the general search or select State and District first.", "error"); return; }
    if (!village || !khasra) {
        const partialQuery = [village, district, state, "India"].filter(Boolean).join(", ");
        if (village) {
            try {
                const geo = await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=" + encodeURIComponent(partialQuery), { headers:{Accept:"application/json"} });
                const results = await geo.json(); initializeMap();
                if (results[0]) { const lat=Number(results[0].lat), lon=Number(results[0].lon); landMap.setView([lat,lon],14); if (mapMarker) mapMarker.remove(); mapMarker=L.marker([lat,lon]).addTo(landMap).bindPopup(escapeHTML(results[0].display_name)).openPopup(); if ($("selectedLocation")) $("selectedLocation").textContent=results[0].display_name; }
            } catch {}
        } else await focusGISLocation();
        const box=$("gisResult"); if(box){ box.hidden=false; box.innerHTML=`<div class="gis-result-note"><b>${escapeHTML(state)} — ${escapeHTML(district)}</b><br>Enter Village/Mouza and Khesara/Survey number, or use the general search box above.</div>`; }
        return;
    }
    try {
        const params = new URLSearchParams({ state, district, village, khasra });
        const response = await fetch(`/api/gis/search?${params}`); const data=await response.json();
        if(!response.ok||!data.success) throw new Error(data.message||"GIS search failed.");
        let lat=data.record?.latitude, lon=data.record?.longitude; let display=data.record?`${data.record.village||village}, ${data.record.district||district}, ${data.record.state||state}`:`${village}, ${district}, ${state}, India`;
        if(!lat||!lon){const q=[khasra,village,district,state,"India"].filter(Boolean).join(", ");const geo=await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q="+encodeURIComponent(q),{headers:{Accept:"application/json"}});const results=await geo.json();if(results[0]){lat=Number(results[0].lat);lon=Number(results[0].lon);display=results[0].display_name;}}
        initializeMap(); setTimeout(()=>landMap?.invalidateSize(),50); if(lat&&lon){landMap.setView([Number(lat),Number(lon)],data.record?.latitude?17:13);if(mapMarker)mapMarker.remove();mapMarker=L.marker([Number(lat),Number(lon)]).addTo(landMap).bindPopup(escapeHTML(display)).openPopup();}
        if($("selectedLocation"))$("selectedLocation").textContent=display;
        const resultBox=$("gisResult");
        if(resultBox){resultBox.hidden=false;resultBox.innerHTML=data.record?`<div class="gis-result-grid">${[["Record ID",data.record.record_id],["State",data.record.state],["District",data.record.district],["Village",data.record.village],["Khesara",data.record.khasra_number||data.record.survey_number||data.record.plot_number],["Area",data.record.area],["Land Type",data.record.land_type],["Status",data.record.status]].map(([k,v])=>`<div><span>${escapeHTML(k)}</span><b>${escapeHTML(v||"—")}</b></div>`).join("")}</div><div class="gis-result-note"><b>Record ID: ${escapeHTML(data.record.record_id||"—")}</b><br><button type="button" class="primary-btn gis-view-record" data-gis-record-id="${escapeHTML(data.record.id)}">View Full Land Record</button><br><button type="button" class="secondary-btn gis-digital-document" data-gis-digital-id="${escapeHTML(data.record.id)}">Open Digital Document</button><br><a href="${escapeHTML(data.record.official_portal||data.official_portal||"https://dolr.gov.in/")}" target="_blank" rel="noopener noreferrer">Open official State/UT land-record portal ↗</a></div>`:`<div class="gis-result-note">No matching digitized parcel was found.</div>`;resultBox.querySelector("[data-gis-record-id]")?.addEventListener("click",e=>viewGISRecord(e.currentTarget.dataset.gisRecordId));
                resultBox.querySelector("[data-gis-digital-id]")?.addEventListener("click",e=>openPublicDigitalDocument(e.currentTarget.dataset.gisDigitalId));}
    }catch(error){console.error("GIS SEARCH ERROR:",error);showToast(error.message||"GIS search failed.","error");}
}

document.addEventListener("DOMContentLoaded", () => {
    initInputRestrictions();
    initLocationSelectors();

    document.querySelectorAll("[data-page]").forEach(button => {
        button.addEventListener("click", () => showPage(button.dataset.page));
    });

    document.querySelectorAll("[data-close]").forEach(button => {
        button.addEventListener("click", () => closeModal(button.dataset.close));
    });

    $("menuButton")?.addEventListener("click", () => {
        $("mobileNav")?.classList.add("open");
        $("menuOverlay")?.classList.add("open");
        $("menuButton")?.setAttribute("aria-expanded", "true");
    });

    $("closeMenu")?.addEventListener("click", closeMenu);
    $("menuOverlay")?.addEventListener("click", closeMenu);

    $("searchMap")?.addEventListener("click", () => { if ($("gisState")?.value) searchGISParcel(); else searchMap(); });
    $("mapSearch")?.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchMap();
        }
    });

    $("zoomIn")?.addEventListener("click", () => landMap?.zoomIn());
    $("zoomOut")?.addEventListener("click", () => landMap?.zoomOut());

    $("locateUser")?.addEventListener("click", () => {
        if (!navigator.geolocation) {
            showToast(msg("currentLocationUnsupported"), "error");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            position => {
                initializeMap();
                const { latitude, longitude } = position.coords;
                landMap.setView([latitude, longitude], 15);
                if (mapMarker) mapMarker.remove();
                mapMarker = L.marker([latitude, longitude]).addTo(landMap);
                showToast(msg("currentLocationSelected"), "success");
            },
            () => showToast("Location permission denied.", "error")
        );
    });

    $("resetMap")?.addEventListener("click", () => {
        initializeMap();
        landMap.setView([22.9734, 78.6569], 5);
        if (mapMarker) {
            mapMarker.remove();
            mapMarker = null;
        }
        if ($("selectedLocation")) $("selectedLocation").textContent = "India — National View";
        if ($("gisResult")) { $("gisResult").hidden = true; $("gisResult").innerHTML = ""; }
    });

    $("chooseFile")?.addEventListener("click", () => $("fileInput")?.click());

    $("fileInput")?.addEventListener("change", async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        if ($("fileName")) $("fileName").textContent = `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        showToast(currentLanguage === "hi" ? "दस्तावेज़ अपलोड हुआ। AI Extraction स्वतः शुरू हो रही है।" : "Document uploaded. AI Extraction is starting automatically.", "info");
        await startAIExtraction();
    });

    $("dropArea")?.addEventListener("dragover", event => {
        event.preventDefault();
        $("dropArea")?.classList.add("drag-active");
    });
    $("dropArea")?.addEventListener("dragleave", () => $("dropArea")?.classList.remove("drag-active"));
    $("dropArea")?.addEventListener("drop", async event => {
        event.preventDefault();
        $("dropArea")?.classList.remove("drag-active");
        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        const input = $("fileInput");
        if (input) {
            try {
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                if ($("fileName")) $("fileName").textContent = `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
                showToast(currentLanguage === "hi" ? "दस्तावेज़ अपलोड हुआ। AI Extraction स्वतः शुरू हो रही है।" : "Document uploaded. AI Extraction is starting automatically.", "info");
                await startAIExtraction();
            } catch {
                showToast(msg("invalidFileType"), "error");
            }
        }
    });

    $("processButton")?.addEventListener("click", startAIExtraction);
    $("userInfoForm")?.addEventListener("submit", event => {
        submitUserRecord(event, "submit");
    });

    $("saveUserDraft")?.addEventListener("click", saveUserDraft);

    $("saveDraft")?.addEventListener("click", saveDraft);
    $("submitRecord")?.addEventListener("click", submitExtractedRecord);

    $("recordSearch")?.addEventListener("input", loadRecords);
    $("statusFilter")?.addEventListener("change", loadRecords);

    // Verification/rejection controls are intentionally not exposed in the user portal.
    // They are available only inside the Officer dashboard.


    document.querySelectorAll("[data-login]").forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.login;
            window.currentLoginType = type;
            if ($("loginType")) $("loginType").textContent = currentLanguage === "hi" ? (type === "admin" ? "प्रशासक एक्सेस" : "अधिकारी एक्सेस") : (type === "admin" ? "ADMIN ACCESS" : "OFFICER ACCESS");
            if ($("loginTitle")) $("loginTitle").textContent = currentLanguage === "hi" ? (type === "admin" ? "लॉगिन" : "अधिकारी लॉगिन") : (type === "admin" ? "Login" : "Officer Login");
            if ($("loginDescription")) $("loginDescription").textContent = currentLanguage === "hi"
                ? (type === "admin" ? "BhuRakshak एडमिन डैशबोर्ड में लॉगिन करें।" : "भूमि रिकॉर्ड की समीक्षा और सत्यापन के लिए लॉगिन करें।")
                : (type === "admin" ? "Sign in to manage the BhuRakshak administrator dashboard." : "Sign in to review and verify user land records.");
            if ($("showSignup")) $("showSignup").style.display = type === "admin" ? "inline-flex" : "none";
            if ($("loginIdentifierLabel")) $("loginIdentifierLabel").textContent = type === "admin" ? (currentLanguage === "hi" ? "फोन नंबर / ईमेल / यूज़र ID" : "Phone / Email / User ID") : (currentLanguage === "hi" ? "Officer ID" : "Officer ID");
            if ($("loginUser")) $("loginUser").placeholder = type === "admin" ? "Enter phone number, email or User ID" : "Enter Officer ID";
            if ($("loginPasswordGroup")) $("loginPasswordGroup").style.display = "block";
            if ($("officerCredentialHint")) $("officerCredentialHint").style.display = type === "officer" ? "block" : "none";
            if ($("captchaGroup")) $("captchaGroup").style.display = "block";
            // Never pre-fill credentials. Officer ID and password must be typed
            // manually by the user, even for the demo officer account.
            if ($("loginUser")) { $("loginUser").value = ""; $("loginUser").removeAttribute("readonly"); }
            if ($("loginPassword")) { $("loginPassword").value = ""; }
            loadLoginCaptcha();
            if ($("loginUser")) $("loginUser").focus();
            openModal("loginModal");
        });
    });


    $("togglePassword")?.addEventListener("click", () => {
        const password = $("loginPassword");
        if (password) password.type = password.type === "password" ? "text" : "password";
    });
    $("refreshCaptcha")?.addEventListener("click", loadLoginCaptcha);

    $("loginForm")?.addEventListener("submit", async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const type=window.currentLoginType||"officer", userId=$("loginUser")?.value.trim()||"", password=$("loginPassword")?.value||"", button=form?.querySelector('button[type="submit"]');
        if(type === "admin" && !password){ showToast(currentLanguage === "hi" ? "पासवर्ड दर्ज करें।" : "Enter your password.", "error"); return; }
        try{
            if(button)button.disabled=true;
            if(type==="admin"&&window.pendingLoginChallenge){
                const response=await fetch("/api/auth/admin/login/verify-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challenge_id:window.pendingLoginChallenge,otp:$("loginOtp")?.value.trim()||""})});
                const data=await response.json(); if(!response.ok||!data.success)throw new Error(data.message||"Login OTP verification failed.");
                localStorage.setItem("bhurakshak-staff-token",data.token);localStorage.setItem("bhurakshak-staff-role",data.role);localStorage.setItem("bhurakshak-staff-name",data.display_name||data.user_id);window.pendingLoginChallenge=null;closeModal("loginModal");showToast("Login successful.","success");setTimeout(()=>window.location.href="/admin.html",250);return;
            }
            const endpoint=type==="admin"?"/api/auth/admin/login":"/api/auth/officer/login";
            const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:userId,identifier:userId,password:$("loginPassword")?.value||"",captcha_id:$("captchaId")?.value||"",captcha_answer:$("captchaAnswer")?.value.trim()||""})});
            const data=await response.json();if(!response.ok||!data.success)throw new Error(data.message||"Login failed.");
            if(type==="admin"&&data.requires_otp){window.pendingLoginChallenge=data.challenge_id;$("loginOtpGroup").hidden=false;$("loginOtp").value="";$("loginOtpStatus").textContent=`OTP sent to ${data.destination_masked}. Enter it to complete login.`;$("loginDemoOtp").hidden=false;$("loginDemoOtp").textContent=`Demo Login OTP: ${data.demo_otp}`;showToast("Password verified. Enter the login OTP to continue.","success");return;}
            localStorage.setItem("bhurakshak-staff-token",data.token);localStorage.setItem("bhurakshak-staff-role",data.role);localStorage.setItem("bhurakshak-staff-name",data.display_name||data.user_id);closeModal("loginModal");showToast("Login successful.","success");
            const pendingDoc = window.pendingOfficerDocumentId;
            window.pendingOfficerDocumentId = null;
            if (type === "officer" && pendingDoc) {
                try {
                    const docResponse = await fetch(`/api/admin/records/${encodeURIComponent(pendingDoc)}/digital-document`, { headers: { Authorization: `Bearer ${data.token}` } });
                    if (!docResponse.ok) throw new Error("Digital document could not be opened.");
                    const html = await docResponse.text();
                    const url = URL.createObjectURL(new Blob([html], {type:"text/html;charset=utf-8"}));
                    window.open(url, "_blank", "noopener");
                    setTimeout(() => URL.revokeObjectURL(url), 60000);
                } catch (e) { showToast(e.message, "error"); }
                setTimeout(()=>window.location.href="/officer.html",250);
            } else {
                setTimeout(()=>window.location.href=data.role==="admin"?"/admin.html":"/officer.html",250);
            }
        }catch(error){showToast(error.message||"Login failed.","error");if(!window.pendingLoginChallenge)loadLoginCaptcha();}finally{if(button)button.disabled=false;}
    });

    $("forgotPasswordLink")?.addEventListener("click", () => {
        const type = window.currentLoginType || "admin";
        if (type !== "admin") return;
        $("forgotIdentifier").value = $("loginUser")?.value?.trim() || "";
        $("resetOtpArea").hidden = true;
        $("resetOtpDemo").hidden = true;
        openModal("forgotPasswordModal");
    });

    $("requestResetOtp")?.addEventListener("click", async () => {
        const identifier = $("forgotIdentifier")?.value.trim() || "";
        if (!identifier) { showToast(currentLanguage === "hi" ? "मोबाइल, ईमेल या यूज़र ID दर्ज करें।" : "Enter your phone, email or User ID.", "error"); return; }
        const button = $("requestResetOtp");
        try {
            button.disabled = true;
            const response = await fetch("/api/auth/admin/forgot-password/request", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({identifier})});
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "Password reset could not be started.");
            $("resetOtpArea").hidden = false;
            if (data.demo_otp) { $("resetOtpDemo").hidden=false; $("resetOtpDemo").textContent = `${currentLanguage === "hi" ? "डेमो रीसेट OTP" : "Demo reset OTP"}: ${data.demo_otp}`; }
            showToast(currentLanguage === "hi" ? "रीसेट OTP बनाया गया है।" : "Reset OTP generated.", "success");
        } catch (error) { showToast(error.message, "error"); } finally { button.disabled = false; }
    });

    $("forgotPasswordForm")?.addEventListener("submit", async event => {
        event.preventDefault();
        const identifier = $("forgotIdentifier")?.value.trim() || "";
        const otp = $("resetOtp")?.value.trim() || "";
        const newPassword = $("resetNewPassword")?.value || "";
        const confirm = $("resetConfirmPassword")?.value || "";
        if (newPassword !== confirm) { showToast(currentLanguage === "hi" ? "पासवर्ड मेल नहीं खाते।" : "Passwords do not match.", "error"); return; }
        try {
            const response = await fetch("/api/auth/admin/forgot-password/reset", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({identifier,otp,new_password:newPassword})});
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "Password reset failed.");
            closeModal("forgotPasswordModal");
            window.currentLoginType = "admin";
            $("loginUser").value = identifier;
            $("loginPassword").value = "";
            await loadLoginCaptcha();
            openModal("loginModal");
            showToast(currentLanguage === "hi" ? "पासवर्ड सफलतापूर्वक रीसेट हो गया। अब लॉगिन करें।" : "Password reset successfully. Please sign in.", "success");
        } catch (error) { showToast(error.message, "error"); }
    });

    $("showSignup")?.addEventListener("click", () => {
        window.currentLoginType = "admin";
        closeModal("loginModal");
        openModal("signupModal");
    });

    $("showLogin")?.addEventListener("click", () => {
        closeModal("signupModal");
        window.currentLoginType = "admin";
        if ($("loginIdentifierLabel")) $("loginIdentifierLabel").textContent = currentLanguage === "hi" ? "फोन नंबर / ईमेल / यूज़र ID" : "Phone / Email / User ID";
        if ($("loginTitle")) $("loginTitle").textContent = currentLanguage === "hi" ? "लॉगिन" : "Login";
        if ($("loginDescription")) $("loginDescription").textContent = currentLanguage === "hi" ? "अपने फोन नंबर या ईमेल से साइन इन करें।" : "Sign in using the phone number or email you registered with.";
        if ($("showSignup")) $("showSignup").style.display = "inline-flex";
        if ($("loginPasswordGroup")) $("loginPasswordGroup").style.display = "block";
        openModal("loginModal");
        loadLoginCaptcha();
    });

    async function sendSignupOtp(channel) {
        const destination = channel === "phone" ? $("signupPhone")?.value.trim() : $("signupEmail")?.value.trim();
        const sendButton = $(channel === "phone" ? "sendPhoneOtp" : "sendEmailOtp");
        const otpInput = $(channel === "phone" ? "phoneOtp" : "emailOtp");
        const verifyButton = $(channel === "phone" ? "verifyPhoneOtp" : "verifyEmailOtp");
        const demoBox = $(channel === "phone" ? "phoneDemoOtp" : "emailDemoOtp");
        const status = $(channel === "phone" ? "phoneOtpStatus" : "emailOtpStatus");
        try {
            if (sendButton) sendButton.disabled = true;
            const response = await fetch("/api/auth/otp/send", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ channel, destination }) });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "OTP could not be generated.");
            if (otpInput) { otpInput.disabled = false; otpInput.value = ""; otpInput.focus(); }
            if (verifyButton) verifyButton.disabled = false;
            if (demoBox) { demoBox.hidden = false; demoBox.textContent = `${currentLanguage === "hi" ? "डेमो OTP" : "Demo OTP"}: ${data.demo_otp}`; }
            if (status) status.textContent = currentLanguage === "hi" ? "OTP भेज दिया गया है।" : "OTP generated. Enter the 6-digit code.";
            showToast(msg(channel === "phone" ? "otpSentPhone" : "otpSentEmail"), "success");
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            if (sendButton) sendButton.disabled = false;
        }
    }

    async function verifySignupOtp(channel) {
        const destination = channel === "phone" ? $("signupPhone")?.value.trim() : $("signupEmail")?.value.trim();
        const otp = $(channel === "phone" ? "phoneOtp" : "emailOtp")?.value.trim();
        const verifyButton = $(channel === "phone" ? "verifyPhoneOtp" : "verifyEmailOtp");
        const status = $(channel === "phone" ? "phoneOtpStatus" : "emailOtpStatus");
        try {
            if (verifyButton) verifyButton.disabled = true;
            const response = await fetch("/api/auth/otp/verify", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ channel, destination, otp }) });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "OTP verification failed.");
            if (status) status.textContent = currentLanguage === "hi" ? "✓ सत्यापित" : "✓ Verified";
            status?.classList.add("verified");
            const input = $(channel === "phone" ? "phoneOtp" : "emailOtp");
            if (input) input.disabled = true;
            showToast(msg(channel === "phone" ? "otpVerifiedPhone" : "otpVerifiedEmail"), "success");
        } catch (error) {
            if (verifyButton) verifyButton.disabled = false;
            showToast(error.message, "error");
        }
    }

    $("sendPhoneOtp")?.addEventListener("click", () => sendSignupOtp("phone"));
    $("verifyPhoneOtp")?.addEventListener("click", () => verifySignupOtp("phone"));
    $("sendEmailOtp")?.addEventListener("click", () => sendSignupOtp("email"));
    $("verifyEmailOtp")?.addEventListener("click", () => verifySignupOtp("email"));

    $("signupForm")?.addEventListener("submit", async event => {
        event.preventDefault();
        const signupForm = event.currentTarget;
        if ($("signupPassword")?.value !== $("signupConfirm")?.value) {
            showToast(currentLanguage === "hi" ? "पासवर्ड मेल नहीं खाते।" : "Passwords do not match.", "error");
            return;
        }
        const phoneVerified = $("phoneOtpStatus")?.classList.contains("verified");
        const emailVerified = $("emailOtpStatus")?.classList.contains("verified");
        if (!phoneVerified || !emailVerified) {
            showToast(currentLanguage === "hi" ? "खाता बनाने से पहले फोन और ईमेल दोनों OTP सत्यापित करें।" : "Verify both the phone and email OTP before creating the account.", "error");
            return;
        }
        const button = signupForm?.querySelector('button[type="submit"]');
        try {
            if (button) button.disabled = true;
            const response = await fetch("/api/auth/admin/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: $("signupName")?.value.trim(),
                    user_id: $("signupUser")?.value.trim(),
                    phone: $("signupPhone")?.value.trim(),
                    email: $("signupEmail")?.value.trim(),
                    password: $("signupPassword")?.value || ""
                })
            });
            const data = await response.json();
            // If the account/identifier already exists, do not show the duplicate-registration
            // error. Take the user straight to Login with the identifier they just entered.
            if (!response.ok || !data.success) {
                if (response.status === 409) {
                    const existingIdentifier = $("signupUser")?.value.trim() || $("signupPhone")?.value.trim() || $("signupEmail")?.value.trim() || "";
                    signupForm?.reset();
                    $("phoneOtpStatus")?.classList.remove("verified");
                    $("emailOtpStatus")?.classList.remove("verified");
                    closeModal("signupModal");
                    window.currentLoginType = "admin";
                    if ($("loginUser")) $("loginUser").value = existingIdentifier;
                    if ($("loginIdentifierLabel")) $("loginIdentifierLabel").textContent = currentLanguage === "hi" ? "फोन नंबर / ईमेल / यूज़र ID" : "Phone / Email / User ID";
                    if ($("loginTitle")) $("loginTitle").textContent = currentLanguage === "hi" ? "लॉगिन" : "Login";
                    if ($("loginDescription")) $("loginDescription").textContent = currentLanguage === "hi"
                        ? "अपने रजिस्टर्ड अकाउंट से लॉगिन करें।"
                        : "Sign in with your registered account.";
                    if ($("showSignup")) $("showSignup").style.display = "inline-flex";
                    openModal("loginModal");
                    await loadLoginCaptcha();
                    return;
                }
                throw new Error(data.message || "Registration failed.");
            }
            const loginIdentifier = data.login_identifier || $("signupPhone")?.value.trim() || $("signupEmail")?.value.trim() || "";
            signupForm?.reset();
            $("phoneOtpStatus")?.classList.remove("verified");
            $("emailOtpStatus")?.classList.remove("verified");
            closeModal("signupModal");
            window.currentLoginType = "admin";
            if ($("loginUser")) $("loginUser").value = loginIdentifier;
            if ($("loginIdentifierLabel")) $("loginIdentifierLabel").textContent = currentLanguage === "hi" ? "फोन नंबर / ईमेल / यूज़र ID" : "Phone / Email / User ID";
            if ($("loginTitle")) $("loginTitle").textContent = currentLanguage === "hi" ? "लॉगिन" : "Login";
            if ($("loginDescription")) $("loginDescription").textContent = currentLanguage === "hi"
                ? "अपने फोन नंबर या ईमेल से साइन इन करें।"
                : "Sign in using the phone number or email you registered with.";
            if ($("showSignup")) $("showSignup").style.display = "inline-flex";
            openModal("loginModal");
            await loadLoginCaptcha();
            showToast(currentLanguage === "hi" ? "खाता बन गया है। अब लॉगिन करें।" : "Account created. Please sign in now.", "success");
        } catch (error) {
            showToast(error.message || "Registration failed.", "error");
        } finally {
            if (button) button.disabled = false;
        }
    });

    $("homeSupport")?.addEventListener("click", () => openModal("supportModal"));
    $("supportMenu")?.addEventListener("click", () => openModal("supportModal"));

    $("supportForm")?.addEventListener("submit", event => {
        event.preventDefault();
        showToast(msg("supportSubmitted"), "success");
        closeModal("supportModal");
    });

    initLanguageSwitcher();
    setupNameFieldValidation();

    initializeMap();
    // Keep public home counters synchronized with the database as records change.
    loadStats();
    setInterval(loadStats, 5000);
    if ($("recordsTable")) setInterval(loadRecords, 5000);

    const query = new URLSearchParams(window.location.search);
    if (query.get("login") === "1") {
        window.currentLoginType = "admin";
        if ($("loginType")) $("loginType").textContent = currentLanguage === "hi" ? "प्रशासक एक्सेस" : "ADMIN ACCESS";
        if ($("loginTitle")) $("loginTitle").textContent = currentLanguage === "hi" ? "लॉगिन" : "Login";
        if ($("loginDescription")) $("loginDescription").textContent = currentLanguage === "hi" ? "अपने फोन नंबर या ईमेल से साइन इन करें।" : "Sign in using your phone number or email.";
        if ($("showSignup")) $("showSignup").style.display = "inline-flex";
        if ($("loginPasswordGroup")) $("loginPasswordGroup").style.display = "block";
        loadLoginCaptcha();
        openModal("loginModal");
        history.replaceState({}, document.title, window.location.pathname);
    }
});

/* Expose functions */
window.searchMap = searchMap;
window.startAIExtraction = startAIExtraction;
window.submitUserRecord = submitUserRecord;
window.submitExtractedRecord = submitExtractedRecord;
window.openUserInformation = openUserInformation;
window.openHumanVerification = openHumanVerification;
window.saveUserDraft = saveUserDraft;
window.showPage = showPage;
window.openModal = openModal;
window.closeModal = closeModal;

const landType = document.getElementById("userLandType");

if (landType) {
    landType.innerHTML = `
        <option value="">Select Land Type</option>
        <option value="Agricultural">Agricultural</option>
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
        <option value="Industrial">Industrial</option>
        <option value="Government">Government</option>
    `;
}