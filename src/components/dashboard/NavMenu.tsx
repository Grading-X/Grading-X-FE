import {Link, useLocation} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import {logout} from "@/api/auth/auth.api.ts";
import {useQueryClient} from "@tanstack/react-query";
import {MEMBER} from "@/const/data.ts";
import {useMemberStore} from "@/store/member.store.ts";
import {cn} from "@/lib/utils.ts";
import {buttonVariants} from "@/components/ui/button.tsx";
import {Home, LibraryBig, LogOut, LucideIcon, Menu, Users2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Separator} from "@/components/ui/separator.tsx";

interface Props {
  isCollapsed: boolean;
}

interface NavLink {
  title: string;
  icon: LucideIcon;
  variant: 'default' | 'ghost';
  to: string;
}


export default function NavMenu({isCollapsed}: Props) {
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const memberStore = useMemberStore();

  const onLogout = () => {
    console.log('logout');
    secureLocalStorage.removeItem('accessToken');
    secureLocalStorage.removeItem('refreshToken');
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({
      queryKey: [MEMBER]
    });
    logout().then(() => {
      memberStore.setData(null);
    });
  }

  const links: NavLink[] = [
    {
      title: '대시보드',
      icon: Menu,
      variant: 'ghost',
      to: '/dashboard'
    },
    {
      title: '강의',
      icon: LibraryBig,
      variant: location.pathname.includes('course') ? 'default' : 'ghost',
      to: '/dashboard/course'
    },
    {
      title: '계정',
      icon: Users2,
      variant: location.pathname.includes('account') ? 'default' : 'ghost',
      to: '/dashboard/account'
    },
  ]

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 h-full"
      >
        <nav className="grid gap-1 px-2 group-[data-collapsed=true]:justify-center group-[data-collapsed=true]:px-2">
          {links.map((link, index) =>
            isCollapsed ? (
              <div key={index}>
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      key={index}
                      to={link.to}
                      className={cn(
                        buttonVariants({variant: link.variant, size: "icon"}),
                        "h-9 w-9",
                        link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                      )}
                    >
                      <link.icon className="h-4 w-4"/>
                      <span className="sr-only">{link.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {link.title}
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (

                <Link
                  key={index}
                  to={link.to}
                  className={cn(
                    buttonVariants({variant: link.variant, size: "sm"}),
                    link.variant === "default" &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                    "justify-start"
                  )}
                >
                  <link.icon className="h-4 w-4 mr-2"/>
                  {link.title}

                </Link>

            )
          )}
          <Separator/>

          {isCollapsed ? (
            <>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link to={'/'}
                        className={cn(
                          buttonVariants({variant: 'ghost', size: "icon"}),
                          "h-9 w-9",
                        )}>

                    <Home className="h-4 w-4"/>
                    <span className="sr-only">메인화면</span>

                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  메인화면
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link to={'/'} onClick={onLogout}
                        className={cn(
                          buttonVariants({variant: 'ghost', size: "icon"}),
                          "h-9 w-9",
                        )}>

                    <LogOut className="h-4 w-4"/>
                    <span className="sr-only">로그아웃</span>

                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  로그아웃
                </TooltipContent>
              </Tooltip>

            </>
          ) : (
            <>
              <Link to={'/'}
                    className={cn(
                      buttonVariants({variant: 'ghost', size: "sm"}),
                      "justify-start"
                    )}>
                <Home className="h-4 w-4 mr-2"/>
                메인화면
              </Link>
              <Link to={'/'} onClick={onLogout}
                    className={cn(
                      buttonVariants({variant: 'ghost', size: "sm"}),
                      "justify-start"
                    )}>
                <LogOut className="h-4 w-4 mr-2"/>
                로그아웃
              </Link>
            </>
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}