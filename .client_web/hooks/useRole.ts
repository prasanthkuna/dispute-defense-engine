import { useState, createContext, useContext } from "react";

export type Role = "Operator" | "Approver" | "Admin";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

export const RoleContext = createContext<RoleContextValue>({
  role: "Operator",
  setRole: () => {},
});

export function useRoleState(): RoleContextValue {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem("dde_role") as Role) || "Operator";
  });

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem("dde_role", r);
  };

  return { role, setRole };
}

export function useRole() {
  return useContext(RoleContext);
}
