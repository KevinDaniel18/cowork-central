"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  LogOut,
  BarChart3,
  Search,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { colors } from "@/constants/colors";

interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  priceHour: number;
  amenities: string[];
  imageUrl?: string;
  description?: string;
  isActive: boolean;
  totalBookings: number;
}

interface Booking {
  id: number;
  spaceId: number;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  notes?: string;
  space: {
    name: string;
    type: string;
  };
}

interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "spaces" | "bookings"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const userResponse = await fetch("/api/auth/me");
      if (!userResponse.ok) {
        window.location.href = "/auth/login";
        return;
      }
      const userData = await userResponse.json();
      setUser(userData.user);

      const spacesResponse = await fetch("/api/spaces");
      if (spacesResponse.ok) {
        const spacesData = await spacesResponse.json();
        setSpaces(spacesData.spaces || []);
      }

      const bookingsResponse = await fetch("/api/bookings");
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch =
      space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || space.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    totalSpaces: spaces.length,
    activeSpaces: spaces.filter((s) => s.isActive).length,
    totalBookings: bookings.length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    totalRevenue: bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: colors.brand.primary[600] }}
        ></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="bg-white shadow-sm border-b"
        style={{ borderColor: colors.border.light }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: colors.gradients.brand }}
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "Resumen", icon: BarChart3 },
              { key: "spaces", label: "Espacios", icon: MapPin },
              { key: "bookings", label: "Reservas", icon: Calendar },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === key
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{
                  backgroundColor:
                    activeTab === key
                      ? colors.brand.primary[600]
                      : "transparent",
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Spaces
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalSpaces}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.brand.primary[100] }}
                  >
                    <MapPin
                      className="w-6 h-6"
                      style={{ color: colors.brand.primary[600] }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Reservations
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalBookings}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.brand.secondary[100] }}
                  >
                    <Calendar
                      className="w-6 h-6"
                      style={{ color: colors.brand.secondary[600] }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completedBookings}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.brand.accent[100] }}
                  >
                    <TrendingUp
                      className="w-6 h-6"
                      style={{ color: colors.brand.accent[600] }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Income</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stats.totalRevenue}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.brand.primary[100] }}
                  >
                    <DollarSign
                      className="w-6 h-6"
                      style={{ color: colors.brand.primary[600] }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: colors.border.light }}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                    style={{ borderColor: colors.border.light }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            booking.status === "COMPLETED"
                              ? colors.brand.primary[500]
                              : colors.brand.accent[500],
                        }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.space.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.startTime).toLocaleDateString()} - $
                          {booking.totalPrice}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor:
                          booking.status === "COMPLETED"
                            ? colors.brand.primary[100]
                            : colors.brand.accent[100],
                        color:
                          booking.status === "COMPLETED"
                            ? colors.brand.primary[700]
                            : colors.brand.accent[700],
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Spaces Tab */}
        {activeTab === "spaces" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar espacios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={
                      {
                        borderColor: colors.border.light,
                        "--tw-ring-color": colors.ring.light,
                      } as any
                    }
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={
                    {
                      borderColor: colors.border.light,
                      "--tw-ring-color": colors.ring.light,
                    } as any
                  }
                >
                  <option value="ALL">All</option>
                  <option value="DESK">Desk</option>
                  <option value="OFFICE">Office</option>
                  <option value="MEETING_ROOM">Meeting room</option>
                  <option value="PHONE_BOOTH">Phone Booth</option>
                </select>
              </div>
            </div>

            {/* Spaces Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space) => (
                <div
                  key={space.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {space.imageUrl && (
                    <img
                      src={space.imageUrl || "/placeholder.svg"}
                      alt={space.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {space.name}
                      </h3>
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: space.isActive
                            ? colors.brand.primary[100]
                            : colors.neutral[200],
                          color: space.isActive
                            ? colors.brand.primary[700]
                            : colors.neutral[600],
                        }}
                      >
                        {space.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{space.type}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {space.capacity}
                        </span>
                        <span>${space.priceHour}/h</span>
                      </div>
                      <button
                        className="px-3 py-1 text-sm font-medium text-white rounded-lg transition-colors"
                        style={{ backgroundColor: colors.brand.primary[600] }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: colors.border.light }}
            >
              <h3 className="text-lg font-medium text-gray-900">
                My Reservations
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y"
                style={{ borderColor: colors.border.light }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Espace
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="bg-white divide-y"
                  style={{ borderColor: colors.border.light }}
                >
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.space.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.space.type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.startTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.startTime).toLocaleTimeString()} -{" "}
                        {new Date(booking.endTime).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor:
                              booking.status === "COMPLETED"
                                ? colors.brand.primary[100]
                                : colors.brand.accent[100],
                            color:
                              booking.status === "COMPLETED"
                                ? colors.brand.primary[700]
                                : colors.brand.accent[700],
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
