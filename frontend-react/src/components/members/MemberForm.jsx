import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  status: "active",
};

export default function MemberForm({
  mode = "add",
  member = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(
    initialForm
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && member) {
      setForm({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        status: member.status || "active",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [isEdit, member]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (form.phone) {
      const phone = form.phone.replace(
        /\D/g,
        ""
      );

      if (
        phone.length < 10 ||
        phone.length > 15
      ) {
        newErrors.phone =
          "Enter a valid phone number.";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      ...(isEdit && {
        status: form.status,
      }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Name *
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter member name"
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Email *
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="member@example.com"
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Status - Edit */}
      {isEdit && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t pt-5">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border px-5 py-2.5 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save Changes"
              : "Add Member"}
        </button>

      </div>

    </form>
  );
}