from flask import Flask, request, render_template, send_file
import os
import openpyxl
from utils.scraper import fetch_all_marketplace_data

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    data = []
    if request.method == "POST":
        product_name = request.form["product"]
        product_url = request.form.get("url", "")
        base_price = float(request.form.get("base_price", 0))
        profit_margin = float(request.form.get("profit_margin", 0))

        data = fetch_all_marketplace_data(product_name, product_url, base_price, profit_margin)

        # Save to Excel
        filepath = os.path.join("static", "output.xlsx")
        os.makedirs("static", exist_ok=True)
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(["Marketplace", "Price", "Profit", "Recommended Selling Price"])
        for item in data:
            ws.append([item['marketplace'], item['price'], item['profit'], item['recommended_price']])
        wb.save(filepath)

    return render_template("index.html", results=data)

@app.route("/download")
def download():
    return send_file("static/output.xlsx", as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
