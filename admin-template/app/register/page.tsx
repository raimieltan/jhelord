"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useRef, useState } from "react";
import { User } from "../types/user";
import { useRouter } from "next/navigation";
import Image from "next/image";


const Register = () => {
  const router = useRouter();
  const fileInputRef = useRef();

  const [personalFormData, setPersonalFormData] = useState<User>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phoneNumber: '',
    email: '',
    role: 'DRIVER',
  });
  const [licenseNumber, setLicenseNumber] = useState('')
  const [unitFormData, setUnitFormData] = useState({
    model: '',
    make: '',
    number: '',
    plateNumber: '',
  });
  const [profileImage, setProfileImage] = useState<any>();
  const [imagePreview, setImagePreview] = useState('/taxi-driver.webp'); // Default image

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setProfileImage(file);
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

  const unitFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitFormData({
      ...unitFormData,
      [e.target.name]: e.target.value,
    });
  };
  // Handle form submission
  const handleSubmit = async () => {

    try {

      const formData = new FormData();
      
      // Append all fields from personalFormData to formData
      Object.keys(personalFormData).forEach(key => {
        formData.append(key, personalFormData[key]);
      });
      
      // Append profileImage file to formData
      // const response = await fetch('https://jhelord-backend.onrender.com/api/users/signup-driver', {
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await fetch('https://jhelord-backend.onrender.com/api/users/signup-driver', {
        method: "POST",
        body: formData
      });
      const userData = await response.json();

      const driver = {
        licenseNumber,
        userId: userData.id,
      }
      // const driverResponse = await fetch('https://jhelord-backend.onrender.com/api/drivers', {
      const driverResponse = await fetch('https://jhelord-backend.onrender.com/api/drivers', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driver),
      })
      const driverData = await driverResponse.json();

      const unit = {
        ...unitFormData,
        driverId: driverData.id,
        status: 'ACTIVE',
        location: {
          latitude: 10.746494047397272,
          longitude: 122.55620305514289,
        }
      }

      // const unitResponse = await fetch('https://jhelord-backend.onrender.com/api/units', {
      const unitResponse = await fetch('https://jhelord-backend.onrender.com/api/units', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unit),
      })
      const unitData = await unitResponse.json()
      router.push('/')

    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Register Driver" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Personal Information
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
                    htmlFor="Password"
                  >
                    Password
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="password"
                    id="Password"
                    value={personalFormData.password}
                    onChange={personalFormHandleChange}
                    placeholder="Enter Password"
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
                <div className="mb-4 flex items-center gap-3">
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

              <div className="border-b border-stroke py-2 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Unit
                </h3>
              </div>
              <form action="#">
                <div className="mb-5.5 mt-4 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="model"
                    >
                      Model
                    </label>
                    <div className="relative">
                      <div className="flex flex-col gap-y-4">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="model"
                          id="model"
                          value={unitFormData.model}
                          onChange={unitFormHandleChange}
                          placeholder="Input Model"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="make"
                    >
                      Make
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="make"
                      id="make"
                      value={unitFormData.make}
                      onChange={unitFormHandleChange}
                      placeholder="Input Make"
                    />
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="number"
                  >
                    Unit Number
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="number"
                      id="number"
                      value={unitFormData.number}
                      onChange={unitFormHandleChange}
                      placeholder="Input Unit Number"
                    />
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Plate Number"
                  >
                    Plate Number
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="plateNumber"
                    id="plateNumber"
                    value={unitFormData.plateNumber}
                    onChange={unitFormHandleChange}
                    placeholder="Input Plate Number"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4.5 mt-5">
          <button
            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            type="submit"
          >
            Cancel
          </button>
          <button
            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
            type="submit"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
