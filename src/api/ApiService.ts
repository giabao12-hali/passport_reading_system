import axios from "axios";
import { ApiPassportResponse } from "./interfaces";

export const fetchUploadApi = async (files: FileList, bookingId: string) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("files", file));

  const response = await axios.post(
    `https://ocr-images.vietravel.com/extract-o-imgs-compare?bookingId=${bookingId}`,
    formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
  );

  const dataUpload = response.data.dataExtract as ApiPassportResponse[];
  return dataUpload
};

export const savePassportDataApi = async (
  passportData: ApiPassportResponse[]
) => {
  try {
    const response = await axios.post(
      "https://ocr-images.vietravel.com/post-id_card_infos",
      passportData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const showPassportDataApi = async (bookingId: string) => {
  try {
    const response = await axios.get(
      `https://ocr-images.vietravel.com/get-data-etour-teporary?bookingId=${bookingId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching", error);
    return [];
  }
};

export const deletePassportDataApi = async (id: number) => {
  try {
    const response = await axios.delete(
      `https://ocr-images.vietravel.com/delete-by-id?id=${id}`
    );
    return response.data;
  } catch (error) {
    console.log("Delete fail:", error);
  }
};
