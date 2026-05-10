<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; position: relative; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; color: #1a1a1a; }
        .header p { margin: 2px 0; font-size: 14px; }
        .logo { position: absolute; left: 0; top: 0; width: 80px; height: 80px; }
        .title { text-align: center; margin-bottom: 40px; }
        .title h2 { text-transform: uppercase; text-decoration: underline; margin-bottom: 5px; font-size: 22px; color: #000; }
        .content { margin-bottom: 60px; text-align: justify; font-size: 15px; }
        .footer { margin-top: 100px; }
        .signature-section { float: right; text-align: center; width: 250px; }
        .signature-name { font-weight: bold; text-transform: uppercase; font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 2px; }
        .signature-title { font-size: 12px; margin-top: 5px; }
        .ref-no { font-size: 10px; color: #777; margin-bottom: 20px; font-family: monospace; }
        .dry-seal { position: absolute; left: 50px; bottom: 150px; width: 120px; height: 120px; border: 2px dashed #ccc; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 10px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="header">
        <p>Republic of the Philippines</p>
        <p>Province of Example Province</p>
        <p>Municipality of Example City</p>
        <h1>Barangay PeopleMap</h1>
        <p><strong>OFFICE OF THE PUNONG BARANGAY</strong></p>
    </div>

    <div class="ref-no">Reference No: {{ $ref_no }}</div>

    <div class="title">
        <h2>BARANGAY CLEARANCE</h2>
    </div>

    <div class="content">
        <p>TO WHOM IT MAY CONCERN:</p>
        <p style="text-indent: 50px;">
            This is to certify that <strong>{{ $resident->first_name }} {{ $resident->middle_initial }} {{ $resident->last_name }}</strong>, 
            of legal age, {{ $resident->civil_status }}, {{ $resident->citizenship }} citizen, is a 
            bona fide resident of <strong>Sitio {{ $resident->sitio->name }}</strong>, Barangay PeopleMap, Example City.
        </p>
        <p style="text-indent: 50px;">
            Based on the records available in this office, the above-named person is known to be of good moral character 
            and has no derogatory record and/or criminal case filed against him/her as of this date.
        </p>
        <p style="text-indent: 50px;">
            This certification is being issued upon the request of the above-named person for the purpose of: 
            <strong>{{ $purpose ?: 'GENERAL PURPOSE' }}</strong>.
        </p>
        <p style="text-indent: 50px;">
            Issued this <strong>{{ $date }}</strong> at Barangay PeopleMap, Example City, Philippines.
        </p>
    </div>

    <div class="dry-seal">
        <p style="text-align: center; margin-top: 45px;">BRGY. DRY SEAL</p>
    </div>

    <div class="footer">
        <div class="signature-section">
            <div class="signature-name">{{ $captain ? $captain->name : 'HON. ROBERTO A. DELA CRUZ' }}</div>
            <div class="signature-title">Punong Barangay</div>
        </div>
    </div>
</body>
</html>
