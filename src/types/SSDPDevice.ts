export interface SSDPDevice {
  address: string;
  family: "IPv4" | "IPv6";
  port: number;
  size: number;
  usn?: string; //The Unique Service Name (USN) of the responding device.
  location: string;
}
