import { Schema, model, models, PaginateModel, Document } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { UserDocument } from "./user";

const VerificationCodeSchema = new Schema(
  {
    scene: { type: String, index: true },
    code: { type: String, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    expiredAt: Date,
    errorCount: { type: Number, default: 0 },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: " VerificationCode",
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

VerificationCodeSchema.plugin(paginate);

export interface VerificationCodeDocument extends Document {
  scene: string;
  code: string;
  user: UserDocument;
  errorCount: number;
  expiredAt: Date;
  locked: boolean;
}

const VerificationCode: PaginateModel<VerificationCodeDocument> =
  (models.VerificationCode as PaginateModel<VerificationCodeDocument>) ||
  model<VerificationCodeDocument, PaginateModel<VerificationCodeDocument>>(
    "VerificationCode",
    VerificationCodeSchema
  );

export default VerificationCode;
