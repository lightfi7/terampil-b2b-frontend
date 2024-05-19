import { RoleSBType } from "@/components/role-switch-button/RoleSwitchButton";
import axios from "axios";
import cookie from "cookie"
import { Employee } from "data-design/src/entity/Employee.entity";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const cookies_name = 'kue-terampil-next';
const sidebar_mode = 'kue-sidebar-mode';

export function getServerTokenCookie(context: GetServerSidePropsContext): string | undefined {
  return cookie.parse(context.req ? context.req.headers.cookie || "" : document.cookie)[cookies_name];
}

export function useTokenCookie() {
  const [cookie, setCookie] = useCookies([cookies_name]);

  function setToken(token: string) {
    setCookie(cookies_name, token, {
      path: "/",
      maxAge: Number.MAX_SAFE_INTEGER,
      sameSite: true,
    });
  }

  function removeToken() {
    setCookie(cookies_name, '', {
      path: "/",
      maxAge: 0,
      sameSite: true,
    });
  }

  function getToken(): string {
    return cookie[cookies_name];
  }

  function isLoggedIn(): boolean {
    return getToken() ? true : false;
  }

  return {
    setToken, removeToken, getToken, isLoggedIn
  };
}

export function useSidebarMode() {
  const [mode, setMode] = useState<RoleSBType>('' as any);

  function setSidebarMode(mode: RoleSBType) {
    localStorage.setItem(sidebar_mode, mode);
    window.dispatchEvent(new Event("storage"));
    setMode(mode);
  }

  useEffect(() => {
    setMode(localStorage.getItem(sidebar_mode) as RoleSBType);
  }, []);

  useEffect(() => {
    const invoke = () => {
      setMode(localStorage.getItem(sidebar_mode) as RoleSBType);
    };
    window.addEventListener('storage', invoke);
    return () => {
      window.removeEventListener('storage', invoke);
    }
  }, []);

  return {
    setSidebarMode, mode
  };
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<WithAdminPageProps|any>> {
  const token = getServerTokenCookie(context);

  if (!token) {
    return NEXT_ERROR_RETURN;
  }

  let admin: Employee | null = null;
  try {
    admin = (await axios.get('/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })).data;
  } catch (err: any) {
    return NEXT_ERROR_RETURN;
  }

  return {
    props: {
      admin
    }
  }
}

export async function initAuthorizationToken(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const NEXT_ERROR_RETURN = {
  redirect: {
    destination: '/login',
    permanent: false
  }
};

export interface WithAdminPageProps {
  admin: Employee
}
