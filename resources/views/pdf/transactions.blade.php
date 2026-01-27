<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #0f172a; }
        .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; }
        .brand-blue { color: #2563eb; }
        .subtitle { font-size: 14px; font-weight: bold; color: #1e293b; margin-top: 5px; text-transform: uppercase; border-left: 4px solid #2563eb; padding-left: 10px; }
        .timestamp { font-size: 10px; color: #94a3b8; margin-top: 10px; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 9px; padding: 12px; text-transform: uppercase; text-align: left; }
        td { padding: 10px; border: 1px solid #f1f5f9; font-size: 11px; vertical-align: top; }

        .badge { padding: 3px 6px; border-radius: 4px; font-size: 8px; font-weight: 800; text-transform: uppercase; }
        .bg-in { background-color: #ecfdf5; color: #059669; border: 1px solid #10b981; }
        .bg-out { background-color: #fff1f2; color: #e11d48; border: 1px solid #fb7185; }
        .bg-sale { background-color: #eff6ff; color: #2563eb; border: 1px solid #60a5fa; }
        
        .footer { position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">SMART<span class="brand-blue">STOCK</span></div>
        <div class="subtitle">Logistics Movement Feed</div>
        <div class="timestamp">Generated at: {{ now()->format('d F Y, H:i:s') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Ref ID</th>
                <th>Resource Details</th>
                <th>Operator</th>
                <th>Type - Category</th>
                <th style="text-align: right;">Delta</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $t)
            <tr>
                <td>SS-{{ $t->id }}AI</td>
                <td><strong>{{ $t->product->name }}</strong><br>{{ $t->product->sku }}</td>
                <td>{{ $t->user->name ?? 'System' }}</td>
                <td>
                    <span class="badge {{ $t->type === 'IN' ? 'bg-in' : ($t->category === 'sale' ? 'bg-sale' : 'bg-out') }}">
                        {{ $t->type }} - {{ $t->category }}
                    </span>
                </td>
                <td style="text-align: right; font-weight: bold;">
                    {{ $t->type === 'IN' ? '+' : '-' }}{{ $t->quantity }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">SmartStock AI System - Logistics Feed</div>
</body>
</html>