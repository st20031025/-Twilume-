export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      customer_name,
      phone,
      email,
      delivery,
      address,
      note,
      product_name,
      product_option,
      quantity,
      total
    } = req.body;

    if (
      !customer_name ||
      !phone ||
      !delivery ||
      !address ||
      !product_name ||
      !quantity ||
      !total
    ) {
      return res.status(400).json({
        error: "請確認必填資料是否完整"
      });
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          customer_name,
          phone,
          email,
          delivery,
          address,
          note,
          product_name,
          product_option,
          quantity,
          total,
          status: "待處理"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: errorText
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      order: data
    });

  } catch (error) {
    return res.status(500).json({
      error: "訂單建立失敗"
    });
  }
}