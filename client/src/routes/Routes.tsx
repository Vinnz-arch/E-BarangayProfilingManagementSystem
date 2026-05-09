import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./path";

// Lazy Loading
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Sitio = React.lazy(() =>import("../pages/sitio/Sitio"));
const SitioResidents = React.lazy(() => import("../pages/sitio/SitioResidents"));
const AddResident = React.lazy(() => import("../pages/sitio/AddResident"));
const EditResident = React.lazy(() => import("../pages/sitio/EditResident"));
const HouseHold = React.lazy(() =>import("../pages/household/Household"));
const Beneficiaries = React.lazy(() =>import("../pages/Beneficiaries/Beneficiaries"));
const Residents = React.lazy(() =>import("../pages/Residents/Residents"));
const BarangayOfficial = React.lazy(() =>import("../pages/BarangayOfficial/BarangayOfficial"));


export const Routes = createBrowserRouter([

  // Authenticated
  {
    path: PATHS.APP.ROOT,
    children: [
      {
        index: true,
        element: <Navigate to={PATHS.APP.DASHBOARD} replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "sitio",
        element: <Sitio />,
      },
      {
        path: "sitio/:id/residents",
        element: <SitioResidents />,
      },
      {
        path: "sitio/:id/residents/create",
        element: <AddResident />,
      },
      {
        path: "sitio/:id/residents/:residentId/edit",
        element: <EditResident />,
      },
      {
        path: "household",
        element: <HouseHold />,
      },
      {
        path: "beneficiaries",
        element: <Beneficiaries />,
      },
      {
        path: "residents",
        element: <Residents />,
      },
      {
        path: "barangayofficials",
        element: <BarangayOfficial />,
      }
    ],
  },

]);

