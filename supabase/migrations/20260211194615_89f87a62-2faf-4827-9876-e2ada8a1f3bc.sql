
-- Enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Praias table
CREATE TABLE public.praias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descricao TEXT NOT NULL DEFAULT '',
    descricao_curta TEXT NOT NULL DEFAULT '',
    fotos TEXT[] DEFAULT '{}',
    latitude DOUBLE PRECISION NOT NULL DEFAULT -22.92,
    longitude DOUBLE PRECISION NOT NULL DEFAULT -42.51,
    filtros TEXT[] DEFAULT '{}',
    dificuldade TEXT DEFAULT 'intermediário',
    estacionamento BOOLEAN DEFAULT false,
    quiosques BOOLEAN DEFAULT false,
    acessivel BOOLEAN DEFAULT false,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.praias ENABLE ROW LEVEL SECURITY;

-- Everyone can read active praias
CREATE POLICY "Anyone can view active praias"
ON public.praias FOR SELECT
USING (ativo = true);

-- Admins can manage praias
CREATE POLICY "Admins can manage praias"
ON public.praias FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Eventos table
CREATE TABLE public.eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL DEFAULT '',
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE,
    imagem TEXT,
    tipo TEXT DEFAULT 'geral',
    local TEXT,
    destaque BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active eventos"
ON public.eventos FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins can manage eventos"
ON public.eventos FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter table
CREATE TABLE public.newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    nome TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter FOR INSERT
WITH CHECK (true);

-- Admins can view/manage subscribers
CREATE POLICY "Admins can manage newsletter"
ON public.newsletter FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Conteudo table for editable content sections
CREATE TABLE public.conteudo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secao TEXT NOT NULL UNIQUE,
    titulo TEXT,
    corpo TEXT,
    imagem TEXT,
    dados JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.conteudo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active conteudo"
ON public.conteudo FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins can manage conteudo"
ON public.conteudo FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_praias_updated_at
BEFORE UPDATE ON public.praias
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at
BEFORE UPDATE ON public.eventos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conteudo_updated_at
BEFORE UPDATE ON public.conteudo
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
