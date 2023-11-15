import React from "react";

const AddressCard = ({ address, handleRemoveAddress, setAsDefaultAddress }) => {
	return (
		<section className="bg-white p-3 m-2 rounded-4">
			<div className="row w-100">
				<div className="col">
					<p className="m-0 text-small text-secondary">Full Name</p>
					<p>{address?.fullName}</p>
					<p className="m-0 text-small text-secondary">Phone Number</p>
					<p>{address?.phoneNumber}</p>
					<p className="m-0 text-small text-secondary">City</p>
					<p>{address?.city}</p>
					<p className="m-0 text-small text-secondary">State</p>
					<p>{address?.state}</p>
				</div>
				<div className="col">
					<p className="m-0 text-small text-secondary">PinCode</p>
					<p>{address?.pinCode}</p>
					<p className="m-0 text-small text-secondary">Address Line 1</p>
					<p>{address?.address1}</p>
					<p className="m-0 text-small text-secondary">Address Line 2</p>
					<p>{address?.address2}</p>
					<p className="m-0 text-small text-secondary">Address Type</p>
					<p>{address?.addressType}</p>
				</div>
			</div>
			<section className="d-flex justify-content-between">
				<button
					onClick={() => handleRemoveAddress(address?._id)}
					className="btn btn-sm bg-danger-subtle  text-danger">
					Remove Address
				</button>
				{address.default ? (
					<button
						disabled={true}
						className="btn btn-sm bg-secondary-subtle  text-secondary">
						Current Default
					</button>
				) : (
					<button
						onClick={() => setAsDefaultAddress(address?._id)}
						className="btn btn-sm bg-secondary-subtle  text-secondary">
						Set as Default
					</button>
				)}
			</section>
		</section>
	);
};

export default AddressCard;
