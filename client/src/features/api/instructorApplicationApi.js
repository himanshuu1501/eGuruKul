import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const INSTRUCTOR_APPLICATION_API =
  "http://localhost:5000/api/v1/instructor-application";

export const instructorApplicationApi = createApi({
  reducerPath: "instructorApplicationApi",
  tagTypes: ["InstructorApplication", "AllApplications"],
  baseQuery: fetchBaseQuery({
    baseUrl: INSTRUCTOR_APPLICATION_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Student: Submit application
    submitInstructorApplication: builder.mutation({
      query: (inputData) => ({
        url: "/apply",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["InstructorApplication", "AllApplications"],
    }),

    // Student: Get own application status
    getMyApplicationStatus: builder.query({
      query: () => ({
        url: "/status",
        method: "GET",
      }),
      providesTags: ["InstructorApplication"],
    }),

    // Admin: Get all applications
    getAllInstructorApplications: builder.query({
      query: () => ({
        url: "/admin/applications",
        method: "GET",
      }),
      providesTags: ["AllApplications"],
    }),

    // Admin: Get single application
    getInstructorApplicationById: builder.query({
      query: (id) => ({
        url: `/admin/applications/${id}`,
        method: "GET",
      }),
    }),

    // Admin: Approve application
    approveInstructorApplication: builder.mutation({
      query: (id) => ({
        url: `/admin/applications/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["InstructorApplication", "AllApplications"],
    }),

    // Admin: Reject application
    rejectInstructorApplication: builder.mutation({
      query: ({ id, rejectionReason }) => ({
        url: `/admin/applications/${id}/reject`,
        method: "PUT",
        body: { rejectionReason },
      }),
      invalidatesTags: ["InstructorApplication", "AllApplications"],
    }),
  }),
});

export const {
  useSubmitInstructorApplicationMutation,
  useGetMyApplicationStatusQuery,
  useGetAllInstructorApplicationsQuery,
  useGetInstructorApplicationByIdQuery,
  useApproveInstructorApplicationMutation,
  useRejectInstructorApplicationMutation,
} = instructorApplicationApi;
