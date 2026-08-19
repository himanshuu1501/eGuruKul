import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useGetAllInstructorApplicationsQuery,
  useApproveInstructorApplicationMutation,
  useRejectInstructorApplicationMutation,
} from "@/features/api/instructorApplicationApi";

const InstructorApplications = () => {
  const { data, isLoading, isError } =
    useGetAllInstructorApplicationsQuery();

  const [approveApplication, { isLoading: approveLoading }] =
    useApproveInstructorApplicationMutation();
  const [rejectApplication, { isLoading: rejectLoading }] =
    useRejectInstructorApplicationMutation();

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (isLoading) return <h1>Loading...</h1>;
  if (isError)
    return (
      <h1 className="text-red-500">Failed to load instructor applications.</h1>
    );

  const applications = data?.applications || [];

  const handleApprove = async (id) => {
    try {
      await approveApplication(id).unwrap();
      toast.success("Application approved. User is now an instructor.");
      setShowDetails(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve application.");
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    try {
      await rejectApplication({
        id: selectedApplication._id,
        rejectionReason,
      }).unwrap();
      toast.success("Application rejected.");
      setShowRejectDialog(false);
      setShowDetails(false);
      setRejectionReason("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject application.");
    }
  };

  const openRejectDialog = (application) => {
    setSelectedApplication(application);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Instructor Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">No instructor applications found.</p>
      ) : (
        <Table>
          <TableCaption>A list of all instructor applications.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Area of Expertise</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application._id}>
                <TableCell className="font-medium">
                  {application.fullName}
                </TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.phoneNumber}</TableCell>
                <TableCell>{application.areaOfExpertise}</TableCell>
                <TableCell>
                  {new Date(application.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {application.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(application._id)}
                          disabled={approveLoading}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openRejectDialog(application)}
                          disabled={rejectLoading}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Application Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the instructor application details below.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Full Name
                  </Label>
                  <p className="text-sm">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </Label>
                  <p className="text-sm">{selectedApplication.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Area of Expertise
                  </Label>
                  <p className="text-sm">
                    {selectedApplication.areaOfExpertise}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Application Date
                  </Label>
                  <p className="text-sm">
                    {new Date(
                      selectedApplication.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Status
                  </Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Professional Bio
                </Label>
                <p className="text-sm mt-1">
                  {selectedApplication.professionalBio}
                </p>
              </div>

              {selectedApplication.linkedinUrl && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    LinkedIn
                  </Label>
                  <p className="text-sm">
                    <a
                      href={selectedApplication.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedApplication.linkedinUrl}
                    </a>
                  </p>
                </div>
              )}

              {selectedApplication.githubUrl && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    GitHub
                  </Label>
                  <p className="text-sm">
                    <a
                      href={selectedApplication.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedApplication.githubUrl}
                    </a>
                  </p>
                </div>
              )}

              {selectedApplication.portfolioUrl && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Portfolio
                  </Label>
                  <p className="text-sm">
                    <a
                      href={selectedApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedApplication.portfolioUrl}
                    </a>
                  </p>
                </div>
              )}

              {selectedApplication.rejectionReason && (
                <div>
                  <Label className="text-sm font-medium text-red-500">
                    Rejection Reason
                  </Label>
                  <p className="text-sm text-red-600">
                    {selectedApplication.rejectionReason}
                  </p>
                </div>
              )}

              {selectedApplication.reviewedBy && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Reviewed By
                  </Label>
                  <p className="text-sm">
                    {selectedApplication.reviewedBy.name} (
                    {selectedApplication.reviewedBy.email})
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedApplication?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetails(false);
                    openRejectDialog(selectedApplication);
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedApplication._id)}
                  disabled={approveLoading}
                >
                  {approveLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Approve"
                  )}
                </Button>
              </>
            )}
            {selectedApplication?.status !== "pending" && (
              <Button onClick={() => setShowDetails(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this application? You can provide
              an optional reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason (Optional)</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectLoading}
            >
              {rejectLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reject Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorApplications;
