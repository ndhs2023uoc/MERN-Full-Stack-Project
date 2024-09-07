import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { MdDeleteSweep } from "react-icons/md";
import { TbFileDollar } from "react-icons/tb";
import { FiDollarSign } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const SelectedClass = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [paginatedData, setPageinatedData] = useState([]);
  const [page, setPage] = useState(1);
  const itemPerPage = 5;
  const totalPages = Math.ceil(classes.length / itemPerPage);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // useEffect(() => {
  //   axiosSecure
  //     .get(`/cart/${currentUser?.email}`)
  //     .then((res) => {
  //       setClasses(res.data);
  //       // const url = `/cart/${currentUser.email}`;
  //       // console.log("Request URL:", url);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    if (currentUser?.email) {
      const url = `/cart/${currentUser.email}`;
      console.log("Request URL:", url); // Check the URL
      axiosSecure
        .get(url)
        .then((res) => {
          setClasses(res.data);
          console.log("Response Data:", res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Request Error:", error);
          setLoading(false);
        });
    } else {
      console.log("No email found for currentUser.");
    }
  }, [currentUser?.email]);

  const totalPrice = classes.reduce(
    (acc, item) => acc + parseInt(item.price),
    0
  );
  const totalTax = totalPrice * 0.01;
  const price = totalPrice + totalTax;

  // const handleDelete = (id) => {
  //   // swal must be import with sweetalert2 .com
  //   Swal.fire({
  //     title: "Are You sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it !".then((result) => {
  //       if (result.isConfirmed) {
  //         axiosSecure
  //           .delete(`/delete-cart-item/${id}`)
  //           .then((res) => {
  //             if (res.data.deletedCount > 0) {
  //               Swal.fire({
  //                 title: "Deleted!",
  //                 text: "Your File has been deleted",
  //                 icon: "success",
  //               });
  //               const newClasses = classes.filter((item) => item._id !== id);
  //               setClasses(newClasses);
  //             }
  //           })
  //           .catch((error) => console.log(error));
  //       }
  //     }),
  //   });
  // };

  const handlePay = (id) => {
    const item = classes.find((item) => item._id === id);
    const price = item.price;
    navigate("/dashboard/user/payment", {
      state: { price: price, itemId: id },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="my-6 text-center">
        <h1 className="text-4xl  font-bold ">
          MY <span className="text-secondary">Selected</span> Class
        </h1>
      </div>

      <div className="h-screen py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart:</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/*Left Side of the page*/}
            <div className="md:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold"># </th>
                      <th className="text-left font-semibold">Product </th>
                      <th className="text-left font-semibold">Prices</th>
                      <th className="text-left font-semibold">Date </th>
                      <th className="text-left font-semibold">Actions </th>
                    </tr>
                  </thead>

                  {/* table body */}
                  <tbody>
                    {classes.length === 0 ? (
                      <tr>
                        <td className="text-center text-2xl font-bold">
                          No Classes
                        </td>
                      </tr>
                    ) : (
                      classes.map((item, index) => {
                        const letIndex = (page - 1) * itemPerPage + index + 1;

                        return (
                          <tr key={item._id}>
                            <td className="py-4">{letIndex}</td>
                            <td className="py-4">
                              <div className="flex items-center">
                                <img
                                  className="h-16 w-16 mr-4 mt-3"
                                  src={item.image}
                                />
                                <span>{item.name}</span>
                              </div>
                            </td>

                            <td className="py-4">${item.price}</td>

                            <td>
                              <p className="text-greem-700 text-sm">
                                {/*for this you have to moments npm package installed */}
                                {moment(item.submitted).format("MMMM Do YYYY")}
                              </p>
                            </td>

                            <td className="flex">
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="px-3 py-1 cursor-pointer bg-red-500 roundedn-3xl text-white font-bold"
                              >
                                <MdDeleteSweep />
                              </button>
                              <button
                                onClick={() => handlePay(item._id)}
                                className="px-3 py-1 cursor-pointer bg-green-500 rounded-3xl text-white font-bold flex items-center"
                              >
                                <FiDollarSign className="mr-2" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/*Right Side of the page*/}
            <div className="md:w-1/5 fixed right-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Summery</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxes</span>
                  <span>${totalTax}.toFixed(2)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Extra Fees</span>
                  <span></span>
                </div>
                <hr className="my-2" />

                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${price.toFixed(2)}</span>
                </div>
                <button
                  disable={price <= 0}
                  onClick={() =>
                    navigate("/dashboard/user/payment", {
                      state: { price: price, itemId: null },
                    })
                  }
                  className="bg-secondary text-white py-2 px-4 rounded-lg w-full"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedClass;
