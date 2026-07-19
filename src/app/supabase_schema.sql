
-- COMMON FUNCTION AND GENERAL PERMISSIONS (Apply once)

-- Ensure the 'update_updated_at_column' function exists (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $function$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $function$ LANGUAGE plpgsql;
    END IF;
END
$$;

-- Grant necessary low-level permissions on the schema.
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

--------------------------------------------------------------------------------
-- RESOURCES TABLE SETUP
--------------------------------------------------------------------------------

-- 1. Create the 'resources' table (if it doesn't already exist)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT,
    link TEXT NOT NULL,
    thumbnail_url TEXT,
    type TEXT NOT NULL, 
    tags TEXT, 
    data_ai_hint TEXT 
);

-- 2. Enable Row Level Security (RLS) on the 'resources' table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 3. Drop old policies for 'resources' IF THEY EXIST to avoid conflicts
DROP POLICY IF EXISTS "Allow server-side management of resources" ON public.resources;
DROP POLICY IF EXISTS "Allow server-side management of resources via app" ON public.resources;
DROP POLICY IF EXISTS "Allow public read access to resources" ON public.resources;

-- 4. Create Policies for 'resources' table:
CREATE POLICY "Allow public read access to resources"
ON public.resources
FOR SELECT
USING (true);

CREATE POLICY "Allow server-side management of resources via app"
ON public.resources
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. Create a Trigger for 'resources' to update 'updated_at'
DROP TRIGGER IF EXISTS handle_resources_updated_at ON public.resources;
CREATE TRIGGER handle_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Grant table-level permissions for 'resources'
GRANT SELECT ON TABLE public.resources TO anon;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.resources TO authenticated;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.resources TO service_role;
GRANT ALL ON TABLE public.resources TO postgres;

--------------------------------------------------------------------------------
-- PROGRAMS TABLE SETUP
--------------------------------------------------------------------------------

-- 1. Create the 'programs' table
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    description TEXT, 
    long_description TEXT, 
    thumbnail_url TEXT,
    learn_more_url TEXT, 
    category TEXT NOT NULL, 
    icon_name TEXT, 
    tags TEXT, 
    data_ai_hint TEXT 
);

-- 2. Enable Row Level Security (RLS) on the 'programs' table
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- 3. Drop old policies for 'programs' IF THEY EXIST
DROP POLICY IF EXISTS "Allow public read access to programs" ON public.programs;
DROP POLICY IF EXISTS "Allow server-side management of programs" ON public.programs; 
DROP POLICY IF EXISTS "Allow server-side management of programs via app" ON public.programs;

-- 4. Create Policies for 'programs' table:
CREATE POLICY "Allow public read access to programs"
ON public.programs
FOR SELECT
USING (true);

CREATE POLICY "Allow server-side management of programs via app"
ON public.programs
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. Create a Trigger for 'programs' to update 'updated_at'
DROP TRIGGER IF EXISTS handle_programs_updated_at ON public.programs;
CREATE TRIGGER handle_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Grant table-level permissions for 'programs'
GRANT SELECT ON TABLE public.programs TO anon;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.programs TO authenticated;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.programs TO service_role;
GRANT ALL ON TABLE public.programs TO postgres;

--------------------------------------------------------------------------------
-- BLOGS TABLE SETUP (Assuming it exists and requires RLS)
--------------------------------------------------------------------------------

-- Ensure 'blogs' table has RLS enabled if it exists.
-- This is a common pattern, adjust if your 'blogs' table exists and has specific needs.
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blogs') THEN
        ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

        -- Drop old policies for 'blogs' IF THEY EXIST
        DROP POLICY IF EXISTS "Allow server-side management of blogs" ON public.blogs;
        DROP POLICY IF EXISTS "Allow server-side management of blogs via app" ON public.blogs;
        DROP POLICY IF EXISTS "Allow public read access to blogs" ON public.blogs;

        -- Create Policies for 'blogs' table:
        CREATE POLICY "Allow public read access to blogs"
        ON public.blogs
        FOR SELECT
        USING (true);

        CREATE POLICY "Allow server-side management of blogs via app"
        ON public.blogs
        FOR ALL
        USING (true)
        WITH CHECK (true);
        
        -- Ensure grants if not already present or if recreating policies changed them
        GRANT SELECT ON TABLE public.blogs TO anon;
        GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.blogs TO authenticated;
        GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.blogs TO service_role;
        GRANT ALL ON TABLE public.blogs TO postgres;

        -- Create Trigger for 'blogs' to update 'updated_at' (if not already present)
        IF NOT EXISTS (
            SELECT FROM pg_trigger 
            WHERE tgname = 'handle_blogs_updated_at' AND tgrelid = 'public.blogs'::regclass
        ) THEN
            CREATE TRIGGER handle_blogs_updated_at
            BEFORE UPDATE ON public.blogs
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
        END IF;

    END IF;
END
$$;

--------------------------------------------------------------------------------
-- STORE_PRODUCTS TABLE SETUP
--------------------------------------------------------------------------------

-- 1. Create the 'store_products' table
CREATE TABLE IF NOT EXISTS public.store_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    thumbnail_url TEXT,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    data_ai_hint TEXT -- For placeholder images on public pages
);

-- 2. Enable Row Level Security (RLS) on the 'store_products' table
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

-- 3. Drop old policies for 'store_products' IF THEY EXIST to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to store products" ON public.store_products;
DROP POLICY IF EXISTS "Allow server-side management of store products via app" ON public.store_products;

-- 4. Create Policies for 'store_products' table:
CREATE POLICY "Allow public read access to store products"
ON public.store_products
FOR SELECT
USING (true);

CREATE POLICY "Allow server-side management of store products via app"
ON public.store_products
FOR ALL 
USING (true) -- Allows operation if triggered by server (app's Firebase auth protects who can trigger).
WITH CHECK (true); -- Allows the data being written.

-- 5. Create a Trigger for 'store_products' to update 'updated_at'
DROP TRIGGER IF EXISTS handle_store_products_updated_at ON public.store_products;
CREATE TRIGGER handle_store_products_updated_at
BEFORE UPDATE ON public.store_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Grant table-level permissions for 'store_products'
GRANT SELECT ON TABLE public.store_products TO anon;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.store_products TO authenticated;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.store_products TO service_role;
GRANT ALL ON TABLE public.store_products TO postgres;

--------------------------------------------------------------------------------
-- PRODUCT_STOCK_NOTIFICATIONS TABLE SETUP
--------------------------------------------------------------------------------

-- 1. Create the 'product_stock_notifications' table
CREATE TABLE IF NOT EXISTS public.product_stock_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    notified_at TIMESTAMPTZ -- To track if/when a notification was sent
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_stock_notifications_product_id ON public.product_stock_notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_notifications_user_email ON public.product_stock_notifications(user_email);


-- 2. Enable Row Level Security (RLS) on the 'product_stock_notifications' table
ALTER TABLE public.product_stock_notifications ENABLE ROW LEVEL SECURITY;

-- 3. Drop old policies for 'product_stock_notifications' IF THEY EXIST to avoid conflicts
DROP POLICY IF EXISTS "Allow users to request stock notifications" ON public.product_stock_notifications;
DROP POLICY IF EXISTS "Allow server-side management of stock notifications" ON public.product_stock_notifications;

-- 4. Create Policies for 'product_stock_notifications' table:

-- Policy 4.1: Allow anonymous users to insert their own notification requests.
CREATE POLICY "Allow users to request stock notifications"
ON public.product_stock_notifications
FOR INSERT
TO anon -- Allow anon role to insert
WITH CHECK (true); -- No specific check beyond what the server action might enforce, like email format.

-- Policy 4.2: Allow authenticated users (intended for server-side admin/service actions) to manage notifications.
-- This allows reading for processing and updating `notified_at`.
CREATE POLICY "Allow server-side management of stock notifications"
ON public.product_stock_notifications
FOR ALL -- SELECT, UPDATE, DELETE (if needed by service_role)
TO service_role -- Restrict to service_role or specific admin role
USING (true)
WITH CHECK (true);

-- If your server actions use the 'authenticated' role with an admin JWT:
-- CREATE POLICY "Allow authenticated admins to manage stock notifications"
-- ON public.product_stock_notifications
-- FOR ALL
-- TO authenticated
-- USING (auth.role() = 'admin') -- Example if you have role claim
-- WITH CHECK (auth.role() = 'admin');

-- 5. Grant table-level permissions for 'product_stock_notifications'
GRANT INSERT ON TABLE public.product_stock_notifications TO anon; -- Allows anonymous users to submit their email.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.product_stock_notifications TO authenticated; -- For potential future use by authenticated users, or admin client.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.product_stock_notifications TO service_role; -- For server-side processes.
GRANT ALL ON TABLE public.product_stock_notifications TO postgres;

