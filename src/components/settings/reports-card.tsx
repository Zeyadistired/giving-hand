import {
  FileLineChartIcon as FileChartLine,
  Download,
  Award,
  BadgeDollarSign,
  BarChartIcon as ChartBar,
  PieChartIcon as ChartPie,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis } from "recharts"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { initializeDatabase } from "@/utils/initializeDatabase"


interface ReportsCardProps {
  isSubscribed: boolean
  onSubscribe: () => void
  userType?: "organization" | "charity"

  user?: {
    fullName: string
    username: string
    email?: string
    role?: string
  }
}

// Mock data for charts and tables
const donationData = [
  { name: "Week 1", value: 120 },
  { name: "Week 2", value: 180 },
  { name: "Week 3", value: 140 },
  { name: "Week 4", value: 220 },
]

const categoryData = [
  { name: "Prepared", value: 45 },
  { name: "Produce", value: 25 },
  { name: "Bakery", value: 15 },
  { name: "Dairy", value: 10 },
  { name: "Other", value: 5 },
]

const promoCodesData = [
  { code: "GIVE10", redemptions: 156, totalDiscount: "1,560 EGP" },
  { code: "FOODLOVER", redemptions: 89, totalDiscount: "890 EGP" },
  { code: "SUMMER23", redemptions: 42, totalDiscount: "840 EGP" },
]

const topDonorsData = [
  { name: "Cairo Marriott Hotel", donations: 8, category: "Cooked Meals" },
  { name: "Oscar Market", donations: 5, category: "Dairy" },
  { name: "Sweet Bakery", donations: 3, category: "Bakery" },
]

const promoBenefitsData = [
  { code: "MEALKHIER", benefit: "15% off delivery services", issuer: "DeliverEgypt" },
  { code: "SWEETDEAL", benefit: "50+ meals campaign", issuer: "Sweet Market" },
  { code: "VITAMEAL", benefit: "10% off groceries", issuer: "Oscar Market" },
]

const ticketInsightsData = {
  acceptedTickets: 23,
  declinedTickets: 3,
  declineRate: "12%",
  avgResponseTime: "18 min",
  fastestResponse: "3 min",
  avgTicketsPerWeek: 6,
  mostRequestedCategory: "Bakery",
}

const COLORS = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#D6BCFA", // Light Purple
  "#8E9196", // Neutral Gray
]

// Add mock data for different time periods
const lastMonthData = {
  donationData: [
    { name: "Week 1", value: 90 },
    { name: "Week 2", value: 150 },
    { name: "Week 3", value: 130 },
    { name: "Week 4", value: 180 },
  ],
  categoryData: [
    { name: "Prepared", value: 40 },
    { name: "Produce", value: 30 },
    { name: "Bakery", value: 20 },
    { name: "Dairy", value: 5 },
    { name: "Other", value: 5 },
  ],
  promoCodesData: [
    { code: "SUMMER22", redemptions: 120, totalDiscount: "1,200 EGP" },
    { code: "FOOD20", redemptions: 75, totalDiscount: "750 EGP" },
  ],
}

const allTimeData = {
  donationData: [
    { name: "Jan", value: 450 },
    { name: "Feb", value: 380 },
    { name: "Mar", value: 520 },
    { name: "Apr", value: 620 },
  ],
  categoryData: [
    { name: "Prepared", value: 42 },
    { name: "Produce", value: 28 },
    { name: "Bakery", value: 18 },
    { name: "Dairy", value: 8 },
    { name: "Other", value: 4 },
  ],
  promoCodesData: [
    { code: "GIVE10", redemptions: 856, totalDiscount: "8,560 EGP" },
    { code: "FOODLOVER", redemptions: 389, totalDiscount: "3,890 EGP" },
    { code: "SUMMER23", redemptions: 242, totalDiscount: "2,420 EGP" },
  ],
}

const PieChartComponent = ({ data = categoryData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={65}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "rgba(255,255,255,0.9)",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            paddingTop: "30px",
            marginBottom: "10px",
            fontSize: "0.8rem",
            color: "#6b7280",
          }}
          formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ReportsCard({ isSubscribed, onSubscribe, userType = "organization", user }: ReportsCardProps) {
  const [activeTab, setActiveTab] = useState("thisMonth")

  // Make sure database is initialized when login form is loaded
  useEffect(() => {
    initializeDatabase()
  }, [])

  const handleDownloadReport = (type: "csv" | "pdf") => {
    const reportData = {
      thisMonth: { donationData, categoryData, promoCodesData },
      lastMonth: lastMonthData,
      allTime: allTimeData,
    }[activeTab]

    if (type === "csv") {
      const csvContent = `data:text/csv;charset=utf-8,
Period: ${activeTab}
Donations Data
Week,Value
${reportData.donationData.map((row) => `${row.name},${row.value}`).join("\n")}

Category Split
Category,Value
${reportData.categoryData.map((row) => `${row.name},${row.value}`).join("\n")}

Promo Codes
Code,Redemptions,Total Discount
${reportData.promoCodesData.map((row) => `${row.code},${row.redemptions},${row.totalDiscount}`).join("\n")}
`

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${activeTab}-report.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("CSV report downloaded successfully!")
    } else if (type === "pdf") {
      toast.success("PDF report downloaded successfully!")
    }
  }

  const handleDownloadCertificate = () => {
    // Create a canvas element
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      toast.error("Unable to create certificate. Please try again.")
      return
    }

    // Set background
    ctx.fillStyle = "#f9f7ff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add border
    ctx.strokeStyle = "#9b87f5"
    ctx.lineWidth = 15
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50)

    // Add inner border
    ctx.strokeStyle = "#7E69AB"
    ctx.lineWidth = 2
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90)

    // Add title
    ctx.font = "bold 48px Arial"
    ctx.fillStyle = "#6E59A5"
    ctx.textAlign = "center"
    ctx.fillText("Certificate of Recognition", canvas.width / 2, 120)

    // Add description
    ctx.font = "24px Arial"
    ctx.fillStyle = "#333"
    ctx.fillText("This certifies that", canvas.width / 2, 200)

    // Add username (use the username from props or fallback to a default)
    const displayName = user?.fullName || "Your Organization"
    ctx.font = "bold 36px Arial"
    ctx.fillStyle = "#6E59A5"
    ctx.fillText(displayName, canvas.width / 2, 260)

    // Add achievement
    ctx.font = "24px Arial"
    ctx.fillStyle = "#333"
    ctx.fillText("is among the", canvas.width / 2, 320)
    ctx.font = "bold 36px Arial"
    ctx.fillStyle = "#6E59A5"
    ctx.fillText(`TOP 5% OF DONORS for ${activeTab}`, canvas.width / 2, 380)

    // Add date
    ctx.font = "20px Arial"
    ctx.fillStyle = "#333"
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, canvas.width / 2, 450)

    // Add logo/award icon
    ctx.font = "80px Arial"
    ctx.fillText("🏆", canvas.width / 2, 530)

    // Convert canvas to PNG and download
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Unable to create certificate image. Please try again.")
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "GivingHand_Certificate.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Certificate downloaded successfully!")
    }, "image/png")
  }

  if (!isSubscribed) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="bg-charity-light w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
            <FileChartLine className="h-8 w-8 text-charity-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Premium Reports</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to access detailed analytics and insights about your donations
          </p>
          <div className="text-2xl font-bold text-charity-primary mb-6">500 EGP/month</div>
          <Button className="w-full bg-charity-primary hover:bg-charity-dark" onClick={onSubscribe}>
            Subscribe Now
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderMetrics = (
    data: typeof donationData | typeof lastMonthData.donationData | typeof allTimeData.donationData,
  ) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <Award className="h-8 w-8 text-charity-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Families Helped</p>
              <p className="text-2xl font-bold">182</p>
              <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                Up 23% from last month
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <BadgeDollarSign className="h-8 w-8 text-charity-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Donation Value</p>
              <p className="text-2xl font-bold">13,500 EGP</p>
              <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                Up 15% from last month
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <ChartBar className="h-8 w-8 text-charity-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Food Waste Reduced</p>
              <p className="text-2xl font-bold">320 kg</p>
              <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <TrendingDown className="h-3 w-3 mr-1" />
                Down 5% from last month
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Premium Insights</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownloadReport("csv")}>
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download as CSV
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReport("pdf")}>
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download as PDF
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="thisMonth" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="thisMonth">This Month</TabsTrigger>
            <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value="thisMonth" className="space-y-6">
            {userType === "organization" ? (
              <>
                {/* Impact Highlights */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Impact Highlights</h3>
                  {renderMetrics(donationData)}
                </section>

                {/* Charts */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Donation Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Weekly Donations</h4>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={donationData}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Category Split</h4>
                        <div className="h-[200px]">
                          <PieChartComponent data={categoryData} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Promo Code Tracking */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Promo Code Tracking</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Promo Code</TableHead>
                            <TableHead>Redemptions</TableHead>
                            <TableHead>Total Discount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {promoCodesData.map((promo) => (
                            <TableRow key={promo.code}>
                              <TableCell className="font-medium">{promo.code}</TableCell>
                              <TableCell>{promo.redemptions}</TableCell>
                              <TableCell>{promo.totalDiscount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* B2B Recognition */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">B2B Recognition</h3>
                  <div className="bg-charity-light p-4 rounded-lg text-center">
                    <Award className="h-12 w-12 text-charity-primary mx-auto mb-2" />
                    <h4 className="text-lg font-semibold">Top Donor</h4>
                    <p className="text-sm mb-4">Your organization is among the top 5% of donors this month!</p>
                    <div className="flex justify-center gap-4 mb-4">
                      <Badge className="bg-charity-primary">Featured Partner</Badge>
                      <Badge className="bg-charity-primary">Sustainability Champion</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleDownloadCertificate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Donor Recognition */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Donor Recognition</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Donations This Month</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topDonorsData.map((donor) => (
                            <TableRow key={donor.name}>
                              <TableCell className="font-medium">{donor.name}</TableCell>
                              <TableCell>{donor.donations}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* Promo Code Benefits */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Promo Code Benefits</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Promo Code</TableHead>
                            <TableHead>Benefit</TableHead>
                            <TableHead>Issuer</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {promoBenefitsData.map((promo) => (
                            <TableRow key={promo.code}>
                              <TableCell className="font-medium">{promo.code}</TableCell>
                              <TableCell>{promo.benefit}</TableCell>
                              <TableCell>{promo.issuer}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* Impact Metrics */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Impact Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartPie className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Meals Distributed</p>
                          <p className="text-2xl font-bold">487</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 18% from last month
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartBar className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">People Served</p>
                          <p className="text-2xl font-bold">215</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 12% from last month
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </>
            )}
          </TabsContent>

          <TabsContent value="lastMonth" className="space-y-6">
            {userType === "organization" ? (
              <>
                {/* Impact Highlights */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Last Month's Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Award className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Families Helped</p>
                          <p className="text-2xl font-bold">150</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 10% from previous month
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <BadgeDollarSign className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Donation Value</p>
                          <p className="text-2xl font-bold">11,250 EGP</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 8% from previous month
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartBar className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Food Waste Reduced</p>
                          <p className="text-2xl font-bold">280 kg</p>
                          <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Down 3% from previous month
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Charts */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Last Month's Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Weekly Donations</h4>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lastMonthData.donationData}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Category Split</h4>
                        <div className="h-[200px]">
                          <PieChartComponent data={lastMonthData.categoryData} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Promo Code Tracking */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Promo Code Tracking</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Promo Code</TableHead>
                            <TableHead>Redemptions</TableHead>
                            <TableHead>Total Discount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lastMonthData.promoCodesData.map((promo) => (
                            <TableRow key={promo.code}>
                              <TableCell className="font-medium">{promo.code}</TableCell>
                              <TableCell>{promo.redemptions}</TableCell>
                              <TableCell>{promo.totalDiscount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* B2B Recognition */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">B2B Recognition</h3>
                  <div className="bg-charity-light p-4 rounded-lg text-center">
                    <Award className="h-12 w-12 text-charity-primary mx-auto mb-2" />
                    <h4 className="text-lg font-semibold">Top Donor</h4>
                    <p className="text-sm mb-4">Your organization is among the top 5% of donors last month!</p>
                    <div className="flex justify-center gap-4 mb-4">
                      <Badge className="bg-charity-primary">Featured Partner</Badge>
                      <Badge className="bg-charity-primary">Sustainability Champion</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleDownloadCertificate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Donor Recognition */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Donor Recognition</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Donations Last Month</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topDonorsData.map((donor) => (
                            <TableRow key={donor.name}>
                              <TableCell className="font-medium">{donor.name}</TableCell>
                              <TableCell>{donor.donations}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* Promo Code Benefits */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Promo Code Benefits</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Promo Code</TableHead>
                            <TableHead>Benefit</TableHead>
                            <TableHead>Issuer</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {promoBenefitsData.map((promo) => (
                            <TableRow key={promo.code}>
                              <TableCell className="font-medium">{promo.code}</TableCell>
                              <TableCell>{promo.benefit}</TableCell>
                              <TableCell>{promo.issuer}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* Impact Metrics */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Impact Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartPie className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Meals Distributed</p>
                          <p className="text-2xl font-bold">420</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 15% from previous month
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartBar className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">People Served</p>
                          <p className="text-2xl font-bold">190</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 10% from previous month
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </>
            )}
          </TabsContent>

          <TabsContent value="allTime" className="space-y-6">
            {userType === "organization" ? (
              <>
                {/* All-time Impact */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">All-time Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Award className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Families Helped</p>
                          <p className="text-2xl font-bold">2500</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 5% from last year
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <BadgeDollarSign className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Donation Value</p>
                          <p className="text-2xl font-bold">150,000 EGP</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 7% from last year
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartBar className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Food Waste Reduced</p>
                          <p className="text-2xl font-bold">4000 kg</p>
                          <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Down 2% from last year
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Historical Charts */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Historical Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Weekly Donations</h4>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={allTimeData.donationData}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Category Split</h4>
                        <div className="h-[200px]">
                          <PieChartComponent data={allTimeData.categoryData} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Promo Code Tracking */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">Promo Code Tracking</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Promo Code</TableHead>
                            <TableHead>Redemptions</TableHead>
                            <TableHead>Total Discount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allTimeData.promoCodesData.map((promo) => (
                            <TableRow key={promo.code}>
                              <TableCell className="font-medium">{promo.code}</TableCell>
                              <TableCell>{promo.redemptions}</TableCell>
                              <TableCell>{promo.totalDiscount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* B2B Recognition */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">B2B Recognition</h3>
                  <div className="bg-charity-light p-4 rounded-lg text-center">
                    <Award className="h-12 w-12 text-charity-primary mx-auto mb-2" />
                    <h4 className="text-lg font-semibold">Top Donor</h4>
                    <p className="text-sm mb-4">Your organization is among the top 5% of donors all time!</p>
                    <div className="flex justify-center gap-4 mb-4">
                      <Badge className="bg-charity-primary">Featured Partner</Badge>
                      <Badge className="bg-charity-primary">Sustainability Champion</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleDownloadCertificate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Donor Recognition */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">All Time Donor Recognition</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Total Donations</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topDonorsData.map((donor) => (
                            <TableRow key={donor.name}>
                              <TableCell className="font-medium">{donor.name}</TableCell>
                              <TableCell>{donor.donations * 8}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>

                {/* Impact Metrics */}
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg">All Time Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartPie className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Meals Distributed</p>
                          <p className="text-2xl font-bold">3,840</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 12% from last year
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <ChartBar className="h-8 w-8 text-charity-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">People Served</p>
                          <p className="text-2xl font-bold">1,950</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Up 8% from last year
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
