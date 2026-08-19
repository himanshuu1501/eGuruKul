import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, GraduationCap, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useSubmitInstructorApplicationMutation,
  useGetMyApplicationStatusQuery,
} from "@/features/api/instructorApplicationApi";

const BecomeInstructor = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const { data: applicationData, isLoading: statusLoading } =
    useGetMyApplicationStatusQuery();

  const [
    submitApplication,
    { isLoading: submitLoading, isSuccess, error },
  ] = useSubmitInstructorApplicationMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    areaOfExpertise: "",
    professionalBio: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    confirmAccuracy: false,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        "Your instructor application has been submitted and is awaiting admin review."
      );
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to submit application.");
    }
  }, [isSuccess, error]);

  // If already instructor or admin, redirect
  if (user?.role === "instructor" || user?.role === "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 my-10 text-center">
        <Card>
          <CardHeader>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <CardTitle>You Already Have Instructor Access</CardTitle>
            <CardDescription>
              You can access the Instructor Dashboard from your account menu.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate("/instructor/dashboard")}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show status if application exists
  const application = applicationData?.application;
  const appStatus = applicationData?.instructorApplicationStatus || "none";

  if (statusLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 my-10 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-gray-500">Loading application status...</p>
      </div>
    );
  }

  if (appStatus === "pending" && application) {
    return (
      <div className="max-w-2xl mx-auto px-4 my-10">
        <Card>
          <CardHeader className="text-center">
            <Clock className="mx-auto h-12 w-12 text-yellow-500 mb-2" />
            <CardTitle>Application Under Review</CardTitle>
            <CardDescription>
              Your instructor application is currently being reviewed by our
              admin team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⏳ Your instructor application is currently under review. Our team
                may contact you for verification or an interview.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Applied on:</span>
                <span>
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-yellow-600">Pending</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (appStatus === "rejected" && application) {
    return (
      <div className="max-w-2xl mx-auto px-4 my-10">
        <Card>
          <CardHeader className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <CardTitle>Application Not Approved</CardTitle>
            <CardDescription>
              Your previous instructor application was not approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                Your instructor application was not approved.
                {application.rejectionReason &&
                  ` Reason: ${application.rejectionReason}`}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              You can submit a new application if you wish.
            </p>
          </CardContent>
        </Card>

        {/* Show form below for resubmission */}
        <Separator className="my-6" />
        <ApplicationForm
          formData={formData}
          setFormData={setFormData}
          submitApplication={submitApplication}
          submitLoading={submitLoading}
          user={user}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 my-10">
      <div className="text-center mb-8">
        <GraduationCap className="mx-auto h-12 w-12 text-blue-600 mb-2" />
        <h1 className="text-2xl font-bold">Become an Instructor</h1>
        <p className="text-gray-500 mt-2">
          Share your knowledge and teach students worldwide. Fill out the form
          below to apply.
        </p>
      </div>

      <ApplicationForm
        formData={formData}
        setFormData={setFormData}
        submitApplication={submitApplication}
        submitLoading={submitLoading}
        user={user}
      />
    </div>
  );
};

const ApplicationForm = ({
  formData,
  setFormData,
  submitApplication,
  submitLoading,
  user,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.areaOfExpertise ||
      !formData.professionalBio
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!formData.confirmAccuracy) {
      toast.error("Please confirm that the information provided is accurate.");
      return;
    }

    const { confirmAccuracy, ...submitData } = formData;
    submitApplication(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor Application</CardTitle>
        <CardDescription>
          Fill in your details below. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              Email is auto-filled from your account.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaOfExpertise">Area of Expertise / Subject *</Label>
            <Input
              id="areaOfExpertise"
              name="areaOfExpertise"
              value={formData.areaOfExpertise}
              onChange={handleChange}
              placeholder="e.g., Web Development, Data Science, Machine Learning"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professionalBio">Professional Bio *</Label>
            <Textarea
              id="professionalBio"
              name="professionalBio"
              value={formData.professionalBio}
              onChange={handleChange}
              placeholder="Briefly describe your experience, qualifications, and what you'd like to teach..."
              rows={4}
              required
            />
          </div>

          <Separator className="my-4" />

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Optional Links
          </p>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input
              id="portfolioUrl"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <Separator className="my-4" />

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              After submitting your application, our team may contact you for
              verification or an interview. Your application will be reviewed
              before instructor access is granted.
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="confirmAccuracy"
              checked={formData.confirmAccuracy}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, confirmAccuracy: checked }))
              }
            />
            <Label htmlFor="confirmAccuracy" className="text-sm font-normal">
              I confirm that the information provided is accurate. *
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitLoading}>
            {submitLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BecomeInstructor;
