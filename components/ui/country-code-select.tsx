"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Flags from "country-flag-icons/react/3x2"

export const COUNTRY_CODES = [
    { code: "+212", country: "MA" },
    { code: "+1", country: "US" },
    { code: "+1", country: "CA" },
    { code: "+44", country: "GB" },
    { code: "+33", country: "FR" },
    { code: "+49", country: "DE" },
    { code: "+34", country: "ES" },
    { code: "+39", country: "IT" },
    { code: "+31", country: "NL" },
    { code: "+32", country: "BE" },
    { code: "+41", country: "CH" },
    { code: "+43", country: "AT" },
    { code: "+46", country: "SE" },
    { code: "+47", country: "NO" },
    { code: "+45", country: "DK" },
    { code: "+358", country: "FI" },
    { code: "+351", country: "PT" },
    { code: "+30", country: "GR" },
    { code: "+353", country: "IE" },
    { code: "+352", country: "LU" },
    { code: "+376", country: "AD" },
    { code: "+377", country: "MC" },
    { code: "+61", country: "AU" },
    { code: "+64", country: "NZ" },
    { code: "+81", country: "JP" },
    { code: "+82", country: "KR" },
    { code: "+86", country: "CN" },
    { code: "+91", country: "IN" },
    { code: "+65", country: "SG" },
    { code: "+852", country: "HK" },
    { code: "+971", country: "AE" },
    { code: "+966", country: "SA" },
    { code: "+974", country: "QA" },
    { code: "+965", country: "KW" },
    { code: "+973", country: "BH" },
    { code: "+968", country: "OM" },
    { code: "+20", country: "EG" },
    { code: "+213", country: "DZ" },
    { code: "+216", country: "TN" },
    { code: "+218", country: "LY" },
    { code: "+249", country: "SD" },
    { code: "+961", country: "LB" },
    { code: "+962", country: "JO" },
    { code: "+972", country: "IL" },
    { code: "+970", country: "PS" },
    { code: "+90", country: "TR" },
    { code: "+55", country: "BR" },
    { code: "+52", country: "MX" },
    { code: "+54", country: "AR" },
    { code: "+56", country: "CL" },
    { code: "+57", country: "CO" },
    { code: "+51", country: "PE" },
    { code: "+27", country: "ZA" },
    { code: "+234", country: "NG" },
    { code: "+254", country: "KE" },
    { code: "+250", country: "RW" },
    { code: "+255", country: "TZ" },
    { code: "+251", country: "ET" },
    { code: "+233", country: "GH" },
    { code: "+221", country: "SN" },
    { code: "+225", country: "CI" },
]

function getFlagIcon(country: string) {
    const FlagComponent = Flags[country as keyof typeof Flags]
    return FlagComponent || Flags.MA // Fallback to MA flag if country not found
}

interface CountryCodeSelectProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function CountryCodeSelect({ value, onChange, disabled }: CountryCodeSelectProps) {
    const selectedCountry = COUNTRY_CODES.find((item) => item.code === value)

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-[110px] h-11">
                <SelectValue placeholder="Code">
                    {selectedCountry && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-5 h-4 flex-shrink-0">
                                {(() => {
                                    const Flag = getFlagIcon(selectedCountry.country)
                                    return <Flag className="w-full h-full rounded-sm" />
                                })()}
                            </span>
                            <span className="font-mono text-sm">{selectedCountry.code}</span>
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {COUNTRY_CODES.map((item) => {
                    const Flag = getFlagIcon(item.country)
                    return (
                        <SelectItem key={`${item.code}-${item.country}`} value={item.code}>
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-4 flex-shrink-0">
                                    <Flag className="w-full h-full rounded-sm" />
                                </span>
                                <span className="font-mono text-sm">{item.code}</span>
                            </span>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
