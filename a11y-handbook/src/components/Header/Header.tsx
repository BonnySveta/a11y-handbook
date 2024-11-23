import { useState, useRef, useEffect } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const HeaderWrapper = styled.div`
  width: 100%;
  background-color: var(--nav-background);
  border-bottom: 1px solid var(--nav-hover-background);

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--text-color);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const NavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: var(--text-secondary-color);
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  display: inline-block;
  position: relative;
  
  &:hover {
    color: var(--text-color);
  }

  &.active {
    color: var(--text-color);
    font-weight: 500;
    
    &::after {
      content: '';
      position: absolute;
      left: 0.5rem;
      right: 0.5rem;
      bottom: 0;
      height: 2px;
      background-color: var(--accent-color);
      border-radius: 2px;
    }
  }
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 76px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    background: var(--nav-background);
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    opacity: ${props => props.$isOpen ? '1' : '0'};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 1000;
    overflow-y: auto;

    ${NavLink} {
      width: 100%;
      padding: 0.75rem;
    }

    ${Controls} {
      width: 100%;
      justify-content: flex-end;
      padding: 1rem;
      margin-top: auto;
      border-top: 1px solid var(--nav-hover-background);
    }
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
  }
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AuthButton = styled.button`
  background: transparent;
  border: 1px solid var(--nav-hover-background);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: var(--nav-hover-background);
  }
`;

const SupportLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.9;
  }

  &.active::after {
    display: none;
  }

  span {
    font-size: 1.1rem;
  }
`;

const AdminMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const AdminMenuContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--nav-background);
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1;
  border-radius: 8px;
  border: 1px solid var(--nav-hover-background);
  margin-top: 0.5rem;

  ${AdminMenu}:hover & {
    display: block;
  }
`;

const AdminMenuItem = styled(NavLink)`
  color: var(--text-color);
  padding: 0.75rem 1rem;
  text-decoration: none;
  display: block;
  font-size: 0.9rem;
  
  &:hover {
    background-color: var(--nav-hover-background);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const AdminLink = styled(NavLink)`
  color: var(--accent-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  
  &:hover {
    background: var(--nav-hover-background);
  }

  &::before {
    content: '👑';
    font-size: 1.1rem;
  }
`;

const BurgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-color);

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 45px;
    height: 37px;
  }
`;

const BurgerLine = styled.span<{ $isOpen: boolean }>`
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--text-color);
  transition: all 0.3s ease;

  &:first-child {
    transform: ${props => props.$isOpen ? 'rotate(45deg) translate(7px, 7px)' : 'none'};
  }

  &:nth-child(2) {
    opacity: ${props => props.$isOpen ? '0' : '1'};
  }

  &:last-child {
    transform: ${props => props.$isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'};
  }
`;

export function Header() {
  const { isAdmin, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const burgerButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const focusableElements = header.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return;

      if (e.key === 'Escape') {
        closeMenu();
        burgerButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }

        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Сохраняем последний активный элемент перед открытием меню
      const lastActiveElement = document.activeElement;
      
      // Фокус на первый элемент меню
      firstFocusable.focus();

      // Запрещаем скролл body
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Возвращаем фокус при закрытии
        if (lastActiveElement instanceof HTMLElement) {
          lastActiveElement.focus();
        }
        // Возвращаем скролл
        document.body.style.overflow = '';
      };
    }
  }, [isMenuOpen]);

  return (
    <HeaderWrapper>
      <HeaderContainer ref={headerRef}>
        <BurgerButton 
          ref={burgerButtonRef}
          onClick={toggleMenu} 
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
        >
          <BurgerLine $isOpen={isMenuOpen} />
          <BurgerLine $isOpen={isMenuOpen} />
          <BurgerLine $isOpen={isMenuOpen} />
        </BurgerButton>

        <Nav id="main-nav" $isOpen={isMenuOpen}>
          <NavList>
            <NavItem>
              <NavLink to="/" end onClick={closeMenu}>Главная</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/feedback" onClick={closeMenu}>Обратная связь</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/suggest" onClick={closeMenu}>Предложить материал</NavLink>
            </NavItem>
            <NavItem>
              <SupportLink to="/support" onClick={closeMenu}>
                <span role="img" aria-hidden="true">❤️</span>
                Поддержать проект
              </SupportLink>
            </NavItem>
          </NavList>
          
          <Controls>
            {isAdmin && (
              <AdminMenu>
                <AdminLink to="/admin" onClick={closeMenu}>
                  Админ-панель
                </AdminLink>
                <AdminMenuContent>
                  <AdminMenuItem to="/admin/suggestions" onClick={closeMenu}>
                    Модерация
                  </AdminMenuItem>
                  <AdminMenuItem to="/admin/approved" onClick={closeMenu}>
                    Одобренные
                  </AdminMenuItem>
                  <AdminMenuItem to="/admin/feedback-list" onClick={closeMenu}>
                    Обратная связь
                  </AdminMenuItem>
                </AdminMenuContent>
              </AdminMenu>
            )}
            <AuthButton 
              onClick={() => {
                isAdmin ? logout() : login();
                closeMenu();
              }}
            >
              {isAdmin ? 'Выйти' : 'Войти как админ'}
            </AuthButton>
            <ThemeToggle />
          </Controls>
        </Nav>
      </HeaderContainer>
    </HeaderWrapper>
  );
}