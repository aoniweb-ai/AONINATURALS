import { userAxios } from '../../AxiosApi/axiosInstance';

/**
 * Send a conversion event to the backend (Meta Conversion API)
 * @param {Object} eventData
 * @returns {Promise}
 */
export const sendMetaConversion = async (eventData) => {
  try {
    const res = await userAxios.post('/conversion/meta-conversion', eventData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
