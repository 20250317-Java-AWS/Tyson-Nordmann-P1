export interface Exoplanet {
    pl_name: string;
    hostname: string;
    sys_dist: number;
    sy_pnum: number;
    sy_snum: number;
    pl_rade?: number;
    pl_radj?:number;
    pl_bmasse?: number;
    pl_bmassj?: number;
    pl_dens?: number;
    pl_orbper: number;
    pl_orbsmax?: number;
    pl_eqt?: number;
    pl_pnum?: number;
    st_teff?: number;
    st_mass?: number;
    st_rad?: number;
    st_logg?: number;
    pl_discmethod?: string;
    pl_status?: string;
    disc_method: string;
    disc_year: number;
    disc_facility: string;
    disc_instrument: string;
    disc_telescope: string;
    ra?: number;
    dec?: number;
    glon?: number;
    glat?: number;
    elon?: number;
    elat?: number;
    solarDistance?: number;


}