import { Router } from "express";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  permissionBodySchema,
  permissionParamsSchema,
  permissionQuerySchema,
  permissionUpdatePayloadSchema,
} from "../schemas/permissions.schema.js";
import {
  createPermissionController,
  deletePermissionController,
  getAllPermissionsController,
  getPermissionByIdController,
  getPermissionMenuController,
  getPermissionWithOutMenuController,
  updatePermissionController,
} from "../controllers/permission.controller.js";

const PermissionRouter: Router = Router();

PermissionRouter.post(
  "/",
  validateSchema(permissionBodySchema, "body"),
  createPermissionController,
);

PermissionRouter.get(
  "/",
  validateSchema(permissionQuerySchema, "query"),
  getAllPermissionsController,
);

PermissionRouter.get("/no-menu", getPermissionWithOutMenuController);
PermissionRouter.get("/menu", getPermissionMenuController);

PermissionRouter.get(
  "/:uuid",
  validateSchema(permissionParamsSchema, "params"),
  getPermissionByIdController,
);

PermissionRouter.put(
  "/:uuid",
  validateSchema(permissionParamsSchema, "params"),
  validateSchema(permissionUpdatePayloadSchema, "body"),
  updatePermissionController,
);

PermissionRouter.delete(
  "/:uuid",
  validateSchema(permissionParamsSchema, "params"),
  deletePermissionController,
);

export default PermissionRouter;
