"use client";

import { IOrder } from "@/database/order.model";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeliverBtn({ order }: { order: IOrder }) {
  const [isMarking, setIsMarking] = useState(false);
  const router = useRouter();

  const markAsDelivered = async (orderId: string) => {
    try {
      const res = await api.put(`/orders/${orderId}`, {
        completed: true,
      });
      toast.success(res.data.message);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to mark order as delivered");
      }
    }
  };

  const markAsUndelivered = async (orderId: string) => {
    try {
      const res = await api.put(`/orders/${orderId}`, {
        completed: false,
      });
      toast.success(res.data.message);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to mark order as undelivered");
      }
    }
  };

  return (
    <>
      {!order.completed ? (
        <button
          disabled={isMarking}
          onClick={() => {
            setIsMarking(true);
            markAsDelivered?.(order._id);
            setIsMarking(false);
          }}
          className="btn btn-submit mt-auto"
        >
          Mark as Delivered
        </button>
      ) : (
        <button
          disabled={isMarking}
          onClick={() => {
            setIsMarking(true);
            markAsUndelivered?.(order._id);
            setIsMarking(false);
          }}
          className="btn btn-delete mt-auto"
        >
          Mark as Undelivered
        </button>
      )}
    </>
  );
}
