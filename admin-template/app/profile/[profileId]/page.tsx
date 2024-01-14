"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DriverBookingTable from "@/components/Tables/DriverBookingTable";
import { useEffect, useRef, useState } from "react";
import { Driver } from "../../types/driver";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import calculateRating from "@/helpers/rating";
import { User } from "@/app/types/user";

const Profile = () => {
  const fileInputRef = useRef();
  const driverId = usePathname().split("/")[2]
  const router = useRouter();

  const [driver, setDriver] = useState<Driver>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<any>();
  const [imagePreview, setImagePreview] = useState(''); // Default image
  const [licenseNumber, setLicenseNumber] = useState<String>('')
  const [personalFormData, setPersonalFormData] = useState<User>({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    email: '',
    role: 'DRIVER',
  });

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const handleEditSubmit = async () => {

    try {

      const formData = new FormData();
      // Append all fields from personalFormData to formData
      Object.keys(personalFormData).forEach(key => {
        formData.append(key, personalFormData[key]);
      });
      
      // Append profileImage file to formData
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await fetch(`https://jhelord-backend.onrender.com/api/users/update-driver/${driverId}`, {
        method: "PUT",
        body: formData
      });

      const currentDriver = {
        licenseNumber,
      }
      const driverResponse = await fetch(`https://jhelord-backend.onrender.com/api/drivers/${driver?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentDriver),
      })
      router.push('/')

    } catch (error: any) {
      console.log(error.message);
    }
  };

  // Handle input changes
  const personalFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalFormData({
      ...personalFormData,
      [e.target.name]: e.target.value,
    });
  };

  const licenseNumberHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicenseNumber(e.target.value);
  };

  const toggleEditMode = () => { // Step 2: toggle function
    setIsEditMode(!isEditMode);
  };

  const fetchDriver = async () => {
    const response = await fetch(`https://jhelord-backend.onrender.com/api/drivers/${driverId}`)
    const data = await response.json();
    console.log(data);
    setDriver(data);
  }

  useEffect(() => {
    fetchDriver();
    if (driver) {
      setImagePreview(`https://jhelord-backend.onrender.com/${driver?.User.profileImage?.slice(4)}`)
      setPersonalFormData(driver.User)
      setLicenseNumber(driver.licenseNumber);
    }
  }, [isEditMode]);

  return (
    <>
      <Breadcrumb pageName="Driver Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

        <div className="flex justify-end items-end m-4">
          {isEditMode ? (
            <div className="flex justify-end gap-4.5 mt-5">
              <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
                type="submit"
                onClick={handleEditSubmit}
              >
                Save
              </button>
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                onClick={toggleEditMode}
              >
                Cancel
              </button>
            </div>
          ) :
            <button
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
              type="submit"
              onClick={toggleEditMode}
            >
              Edit
            </button>
          }
        </div>
        {isEditMode ? (
          <div>
            <div className="border-b border-stroke py-2 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Edit Driver Personal Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="p-7">
                <form>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          {/* TODO ICON */}
                        </span>
                        <div className="flex flex-r gap-x-4">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={personalFormData.firstName}
                            onChange={personalFormHandleChange}
                            placeholder="Input First Name"
                          />
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={personalFormData.lastName}
                            onChange={personalFormHandleChange}
                            placeholder="Input Last Name"
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={personalFormData.phoneNumber}
                      onChange={personalFormHandleChange}
                      placeholder="Input Phone Number"
                      defaultValue=""
                    />
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        id="email"
                        value={personalFormData.email}
                        onChange={personalFormHandleChange}
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Username
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="username"
                      id="Username"
                      value={personalFormData.username}
                      onChange={personalFormHandleChange}
                      placeholder="Enter Username"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="License Number"
                    >
                      License Number
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="licenseNumber"
                      id="LicenseNumber"
                      value={licenseNumber}
                      onChange={licenseNumberHandleChange}
                      placeholder="Input License Number"
                    />
                  </div>
                </form>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-10 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <Image
                        src={imagePreview}
                        width={55}
                        height={55}
                        alt="User"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Upload Driver photo
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {/* TODO: ICON */}
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5 w-full">
            <div className="flex justify-center items-center mx-auto my-10 h-full w-full">
              <div className="w-52 max-w-75 rounded-lg overflow-hidden">
                <Image
                  src={`https://jhelord-backend.onrender.com/${driver?.User.profileImage?.slice(4)}`}
                  width={500}
                  height={500}
                  alt="profile"
                  className="object-cover" // ensures the image covers the entire area
                />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {driver?.User.firstName} {driver?.User.lastName}
              </h3>
              <p className="font-medium">
                {driver?.User.username}
              </p>
              <p className="font-medium">
                License: <span className="font-bold text-white">{driver?.licenseNumber}</span>
              </p>
              <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-sm">
                    Unit: {driver?.unit.length ? driver?.unit[0].number : 0}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {driver?.booking.length}
                  </span>
                  <span className="text-sm">Bookings</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {driver?.driverReview.length ? calculateRating(driver?.driverReview) : 0}/5
                  </span>
                  <span className="text-sm">Ratings</span>
                </div>
              </div>

              <DriverBookingTable bookings={driver?.booking} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
