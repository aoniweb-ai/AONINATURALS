import axios from "axios"
export const sendConversion = async (req, res) => {
  const { event_name, event_time, user_data, custom_data } = req.body;
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
      {
        data: [
          {
            event_name,
            event_time: event_time || Math.floor(Date.now() / 1000),
            user_data,
            custom_data,
            action_source: 'website',
          },
        ],
      }
    );
    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};
