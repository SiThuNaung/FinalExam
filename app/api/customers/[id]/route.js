import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const body = await req.json();
    const customer = await Customer.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const deletedCustomer = await Customer.deleteOne({ _id: id });
    if (!deletedCustomer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
