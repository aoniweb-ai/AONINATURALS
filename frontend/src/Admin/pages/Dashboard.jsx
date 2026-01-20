import React from 'react'
import {
  Menu,
} from "lucide-react";
const Dashboard = () => {
  return (
    <div className="drawer-content flex flex-col min-h-screen">

        {/* Navbar */}
        <div className="navbar bg-base-100 shadow px-4 lg:px-6">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="admin-drawer"
              className="btn btn-ghost btn-square"
            >
              <Menu />
            </label>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
          </div>

          <span className="badge badge-accent">Admin</span>
        </div>

        {/* Scrollable page content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <p className="text-sm opacity-70">Total Sales</p>
                <h3 className="text-2xl font-bold text-primary">₹45,000</h3>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <p className="text-sm opacity-70">Orders</p>
                <h3 className="text-2xl font-bold text-secondary">120</h3>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <p className="text-sm opacity-70">Customers</p>
                <h3 className="text-2xl font-bold text-accent">80</h3>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <p className="text-sm opacity-70">Products</p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">
                Recent Orders
              </h3>

              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#1021</td>
                      <td>Rahul</td>
                      <td>
                        <span className="badge badge-success">
                          Delivered
                        </span>
                      </td>
                      <td>₹999</td>
                    </tr>
                    <tr>
                      <td>#1022</td>
                      <td>Anjali</td>
                      <td>
                        <span className="badge badge-warning">
                          Pending
                        </span>
                      </td>
                      <td>₹1,299</td>
                    </tr>
                    <tr>
                      <td>#1023</td>
                      <td>Amit</td>
                      <td>
                        <span className="badge badge-error">
                          Cancelled
                        </span>
                      </td>
                      <td>₹799</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </main>
      </div>
  )
}

export default Dashboard