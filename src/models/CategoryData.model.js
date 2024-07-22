const mongoose = require("mongoose");

const ApiDynamicFieldsSchema = new Schema({
  key: {
    type: String,
    required: [true, "Key is required"],
  },
  value: {
    type: Schema.Types.Mixed,
    required: [true, "Value is required"],
  },
  constraints: Schema.Types.Mixed,
});

const CategoryDataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    visibility: {
      type: Boolean,
      default: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    permission: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserData",
        validate: {
          validator: async function (value) {
            const user = await UserData.findById(value);
            return user !== null;
          },
          message: (props) => `UserData with ID ${props.value} not found`,
        },
      },
    ],
    ApiSchemaFields: [ApiDynamicFieldsSchema],
  },
  { timestamps: true }
);

const CategoryData = mongoose.model("CategoryData", CategoryDataSchema);

module.exports = CategoryData;
