import { Router } from "express";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  createRolePayloadSchema,
  getRoleQuerySchema,
  roleParamsSchema,
  updateRolePermissionPayloadSchema,
} from "../schemas/role.schema.js";
import {
  createRoleController,
  deleteRoleController,
  getRoleController,
  updateRolePermissionController,
} from "../controllers/role.controller.js";

const RoleRouter: Router = Router();

RoleRouter.post(
  "/",
  validateSchema(createRolePayloadSchema, "body"),
  createRoleController,
);

RoleRouter.get(
  "/",
  validateSchema(getRoleQuerySchema, "query"),
  getRoleController,
);

RoleRouter.put(
  "/:uuid",
  validateSchema(roleParamsSchema, "params"),
  validateSchema(updateRolePermissionPayloadSchema, "body"),
  updateRolePermissionController,
);

RoleRouter.delete(
  "/:uuid",
  validateSchema(roleParamsSchema, "params"),
  deleteRoleController,
);

export default RoleRouter;
