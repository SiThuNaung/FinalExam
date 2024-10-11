import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const customers = await Customer.find({});
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const customer = await Customer.create(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
