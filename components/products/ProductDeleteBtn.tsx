"use client";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const ProductDeleteBtn = ({ productId }: { productId: string }) => {
  const [disableDelete, setDisableDelete] = useState(false);

  const router = useRouter();

  async function deleteProduct(_id: string) {
    try {
      const res = await api.delete(`/products/${_id}`);
      toast.success(res.data.message);
      router.refresh();
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message || e.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setDisableDelete(false);
    }
  }

  return (
    <form
      className="inline-block"
      onSubmit={(e) => {
        e.preventDefault();
        setDisableDelete(true);
        deleteProduct(productId);
      }}
    >
      <button
        disabled={disableDelete}
        type="submit"
        className="btn btn-delete px-4 py-2 text-sm"
      >
        Delete
      </button>
    </form>
  );
};
