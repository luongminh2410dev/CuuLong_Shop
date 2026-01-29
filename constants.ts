import { Equipment, LeasingPartner } from "./types";
import equipmentData from "./data/equipment.json";
import leasingPartnersData from "./data/leasing-partners.json";

/**
 * Dữ liệu sản phẩm thiết bị được import từ file JSON
 * File nguồn: ./data/equipment.json
 */
export const EQUIPMENT_DATA: Equipment[] = equipmentData as Equipment[];

export const LEASING_PARTNERS: LeasingPartner[] =
  leasingPartnersData as LeasingPartner[];
