<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
        .header p { margin: 2px 0; font-size: 14px; }
        .title { text-align: center; margin-bottom: 40px; }
        .title h2 { text-transform: uppercase; text-decoration: underline; margin-bottom: 5px; font-size: 22px; }
        .content { margin-bottom: 60px; text-align: justify; font-size: 15px; }
        .footer { margin-top: 100px; }
        .signature-section { float: right; text-align: center; width: 250px; }
        .signature-name { font-weight: bold; text-transform: uppercase; font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 2px; }
        .signature-title { font-size: 12px; margin-top: 5px; }
        .ref-no { font-size: 10px; color: #777; margin-bottom: 20px; font-family: monospace; }
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
        <h2>CERTIFICATE OF INDIGENCY</h2>
    </div>

    <div class="content">
        <p>TO WHOM IT MAY CONCERN:</p>
        <p style="text-indent: 50px;">
            This is to certify that <strong>{{ $resident->first_name }} {{ $resident->middle_name }} {{ $resident->last_name }}</strong>, 
            of legal age, {{ $resident->civil_status }}, {{ $resident->citizenship }} citizen, is a 
            bona fide resident of Sitio {{ $resident->sitio->name }}, Barangay PeopleMap, Example City.
        </p>
        <p style="text-indent: 50px;">
            This is to certify further that the above-named person belongs to an indigent family in this barangay 
            and has no fixed source of income or whose income is below the poverty threshold.
        </p>
        <p style="text-indent: 50px;">
            This certification is being issued upon the request of the above-named person for whatever legal purpose 
            it may serve, specifically for: <strong>{{ $purpose ?: 'SCHOLARSHIP/MEDICAL ASSISTANCE/FINANCIAL ASSISTANCE' }}</strong>.
        </p>
        <p style="text-indent: 50px;">
            Issued this <strong>{{ $date }}</strong> at Barangay PeopleMap, Example City, Philippines.
        </p>
    </div>

    <div class="footer">
        <div class="signature-section">
            <div class="signature-name">{{ $captain ? $captain->name : 'HON. ROBERTO A. DELA CRUZ' }}</div>
            <div class="signature-title">Punong Barangay</div>
        </div>
    </div>
</body>
</html>
